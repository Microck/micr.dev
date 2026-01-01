import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { isAuthenticated, getCorsHeaders } from './lib/auth';
import { commitMultipleFiles } from './lib/github';
import { processImage, getImagePaths } from './lib/image';

interface PendingImage {
  buildId: string;
  index: number;
  base64: string;
}

interface PendingBuild {
  id: string;
  title: string;
  youtubeTitle?: string;
  category: 'MX' | 'EC';
  timestamp: string;
  images: string[];
  youtubeUrl: string;
  specs: Record<string, string | undefined>;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface DeployRequest {
  pendingImages: PendingImage[];
  pendingBuilds: PendingBuild[];
  pendingRankings?: Record<string, string[]>;
  currentBuilds: PendingBuild[];
  currentRankings?: Record<string, string[]>;
}

// Process images in batches to avoid memory issues
const BATCH_SIZE = 5;

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const corsHeaders = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (!isAuthenticated(event)) {
    return {
      statusCode: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    let body: DeployRequest;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      };
    }

    const { pendingImages = [], pendingBuilds = [], pendingRankings, currentBuilds = [] } = body;
    
    const allFilesToCommit: Array<{ path: string; content: string }> = [];
    
    // Process pending images in batches
    if (pendingImages.length > 0) {
      for (let i = 0; i < pendingImages.length; i += BATCH_SIZE) {
        const batch = pendingImages.slice(i, i + BATCH_SIZE);
        
        for (const img of batch) {
          try {
            const buffer = Buffer.from(img.base64, 'base64');
            const processed = await processImage(buffer);
            const paths = getImagePaths(img.buildId, img.index);
            
            allFilesToCommit.push({
              path: paths.full,
              content: processed.full.toString('base64'),
            });
            allFilesToCommit.push({
              path: paths.thumbnail,
              content: processed.thumbnail.toString('base64'),
            });
          } catch (imgError) {
            console.error(`Failed to process image ${img.buildId}/${img.index}:`, imgError);
            // Continue with other images
          }
        }
      }
    }
    
    // Merge pending builds with current builds
    let finalBuilds = [...currentBuilds];
    
    if (pendingBuilds.length > 0) {
      for (const pending of pendingBuilds) {
        if (pending.isDeleted) {
          finalBuilds = finalBuilds.filter(b => b.id !== pending.id);
        } else if (pending.isNew) {
          const { isNew: _, isDeleted: __, ...build } = pending;
          finalBuilds.unshift(build);
        } else {
          const idx = finalBuilds.findIndex(b => b.id === pending.id);
          if (idx >= 0) {
            const { isNew: _, isDeleted: __, ...build } = pending;
            finalBuilds[idx] = build;
          } else {
            // Build not found, add it
            const { isNew: _, isDeleted: __, ...build } = pending;
            finalBuilds.push(build);
          }
        }
      }
    }
    
    // Add builds.json to commit
    allFilesToCommit.push({
      path: 'microkeebs/src/data/builds.json',
      content: Buffer.from(JSON.stringify(finalBuilds, null, 2)).toString('base64'),
    });
    
    // Add rankings if changed
    if (pendingRankings) {
      allFilesToCommit.push({
        path: 'microkeebs/src/data/rankings.json',
        content: Buffer.from(JSON.stringify(pendingRankings, null, 2) + '\n').toString('base64'),
      });
    }
    
    // Commit everything at once
    const imageCount = pendingImages.length;
    const commitMessage = imageCount > 0
      ? `Update builds and add ${imageCount} image(s)`
      : 'Update builds';
    
    await commitMultipleFiles(allFilesToCommit, commitMessage);
    
    // Trigger Netlify build
    const buildHook = process.env.NETLIFY_BUILD_HOOK;
    if (buildHook) {
      try {
        await fetch(buildHook, { method: 'POST', body: '{}' });
      } catch (hookError) {
        console.error('Failed to trigger build hook:', hookError);
        // Don't fail the whole deploy if hook fails
      }
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        message: `Deployed ${allFilesToCommit.length} files`,
        imagesProcessed: imageCount,
      }),
    };
  } catch (error) {
    console.error('Deploy error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Deploy failed';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: errorMessage, details: String(error) }),
    };
  }
};
