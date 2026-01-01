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
  // For chunked image uploads
  imageChunk?: PendingImage[];
  chunkIndex?: number;
  totalChunks?: number;
  
  // For final deploy (builds + rankings)
  finalDeploy?: boolean;
  pendingBuilds?: PendingBuild[];
  pendingRankings?: Record<string, string[]>;
  currentBuilds?: PendingBuild[];
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
    let body: DeployRequest;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      };
    }

    // Handle image chunk upload
    if (body.imageChunk && body.imageChunk.length > 0) {
      const filesToCommit: Array<{ path: string; content: string }> = [];
      
      for (const img of body.imageChunk) {
        try {
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
        } catch (imgError) {
          console.error(`Failed to process image ${img.buildId}/${img.index}:`, imgError);
        }
      }
      
      if (filesToCommit.length > 0) {
        const chunkInfo = body.chunkIndex !== undefined ? ` (chunk ${body.chunkIndex + 1}/${body.totalChunks})` : '';
        await commitMultipleFiles(filesToCommit, `Add ${body.imageChunk.length} image(s)${chunkInfo}`);
      }
      
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true, 
          imagesProcessed: body.imageChunk.length,
          chunkIndex: body.chunkIndex,
        }),
      };
    }

    // Handle final deploy (builds.json + rankings + trigger build)
    if (body.finalDeploy) {
      const { pendingBuilds = [], pendingRankings, currentBuilds = [] } = body;
      const filesToCommit: Array<{ path: string; content: string }> = [];
      
      // Merge pending builds with current builds
      let finalBuilds = [...currentBuilds];
      
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
            const { isNew: _, isDeleted: __, ...build } = pending;
            finalBuilds.push(build);
          }
        }
      }
      
      // Add builds.json
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
      
      await commitMultipleFiles(filesToCommit, 'Update builds');
      
      // Trigger Netlify build
      const buildHook = process.env.NETLIFY_BUILD_HOOK;
      if (buildHook) {
        try {
          await fetch(buildHook, { method: 'POST', body: '{}' });
        } catch (hookError) {
          console.error('Failed to trigger build hook:', hookError);
        }
      }

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Deploy complete' }),
      };
    }

    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid request - need imageChunk or finalDeploy' }),
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
