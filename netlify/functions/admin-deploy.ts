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
    const body = JSON.parse(event.body || '{}') as DeployRequest;
    const { pendingImages, pendingBuilds, pendingRankings, currentBuilds, currentRankings } = body;
    
    const filesToCommit: Array<{ path: string; content: string }> = [];
    
    // Process pending images
    if (pendingImages && pendingImages.length > 0) {
      for (const img of pendingImages) {
        const buffer = Buffer.from(img.base64, 'base64');
        const processed = await processImage(buffer);
        const paths = getImagePaths(img.buildId, img.index);
        
        filesToCommit.push({
          path: paths.full,
          content: processed.full.toString('base64'),
        });
        filesToCommit.push({
          path: paths.thumbnail,
          content: processed.thumbnail.toString('base64'),
        });
      }
    }
    
    // Merge pending builds with current builds
    let finalBuilds = [...currentBuilds];
    
    if (pendingBuilds && pendingBuilds.length > 0) {
      for (const pending of pendingBuilds) {
        if (pending.isDeleted) {
          finalBuilds = finalBuilds.filter(b => b.id !== pending.id);
        } else if (pending.isNew) {
          // Add new build at the beginning
          const { isNew, ...build } = pending;
          finalBuilds.unshift(build);
        } else {
          // Update existing build
          const idx = finalBuilds.findIndex(b => b.id === pending.id);
          if (idx >= 0) {
            const { isNew, isDeleted, ...build } = pending;
            finalBuilds[idx] = build;
          }
        }
      }
    }
    
    // Add builds.json to commit
    filesToCommit.push({
      path: 'microkeebs/src/data/builds.json',
      content: Buffer.from(JSON.stringify(finalBuilds, null, 2)).toString('base64'),
    });
    
    // Add rankings if changed
    if (pendingRankings) {
      filesToCommit.push({
        path: 'microkeebs/src/data/rankings.json',
        content: Buffer.from(JSON.stringify(pendingRankings, null, 2) + '\n').toString('base64'),
      });
    }
    
    // Commit everything at once
    const commitMessage = pendingImages.length > 0
      ? `Update builds and add ${pendingImages.length} image(s)`
      : 'Update builds';
    
    await commitMultipleFiles(filesToCommit, commitMessage);
    
    // Trigger Netlify build
    const buildHook = process.env.NETLIFY_BUILD_HOOK;
    if (buildHook) {
      await fetch(buildHook, { method: 'POST', body: '{}' });
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        message: `Deployed ${filesToCommit.length} files`,
        imagesProcessed: pendingImages?.length || 0,
      }),
    };
  } catch (error) {
    console.error('Deploy error:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Deploy failed' }),
    };
  }
};
