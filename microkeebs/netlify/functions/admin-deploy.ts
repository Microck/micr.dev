import type { Handler, HandlerEvent } from '@netlify/functions';
import { isAuthenticated, getCorsHeaders } from './lib/auth';
import { commitMultipleFiles } from './lib/github';
import { processImage, getImagePaths, isValidBuildId } from './lib/image';

interface PendingImage {
  buildId: string;
  index: number;
  base64: string;
}

interface ProcessedImage {
  buildId: string;
  index: number;
  fullBase64: string;
  thumbBase64: string;
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
  // For processing images (returns processed, no commit)
  processImages?: PendingImage[];
  chunkIndex?: number;
  totalChunks?: number;
  
  // For committing a batch of processed images
  commitImages?: ProcessedImage[];
  commitChunkIndex?: number;
  commitTotalChunks?: number;
  
  // For final deploy (just builds + rankings, images already committed)
  finalDeploy?: boolean;
  pendingBuilds?: PendingBuild[];
  pendingRankings?: Record<string, string[]>;
  currentBuilds?: PendingBuild[];
}

function stripPendingFlags(build: PendingBuild): Omit<PendingBuild, 'isNew' | 'isDeleted'> {
  const { isNew, isDeleted, ...rest } = build;
  void isNew;
  void isDeleted;
  return rest;
}

export const handler: Handler = async (event: HandlerEvent) => {
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

    // Phase 1: Process images (no commit, returns processed data)
    if (body.processImages && body.processImages.length > 0) {
      if (body.processImages.some((img) => !isValidBuildId(img.buildId) || !Number.isInteger(img.index) || img.index < 0)) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid image payload' }),
        };
      }

      const processed: ProcessedImage[] = [];
      
      for (const img of body.processImages) {
        const buffer = Buffer.from(img.base64, 'base64');
        const result = await processImage(buffer);
        processed.push({
          buildId: img.buildId,
          index: img.index,
          fullBase64: result.full.toString('base64'),
          thumbBase64: result.thumbnail.toString('base64'),
        });
      }
      
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true, 
          processed,
          chunkIndex: body.chunkIndex,
        }),
      };
    }

    // Phase 2: Commit a batch of processed images
    if (body.commitImages && body.commitImages.length > 0) {
      if (body.commitImages.some((img) => !isValidBuildId(img.buildId) || !Number.isInteger(img.index) || img.index < 0)) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid processed image payload' }),
        };
      }

      const filesToCommit: Array<{ path: string; content: string }> = [];
      
      for (const img of body.commitImages) {
        const paths = getImagePaths(img.buildId, img.index);
        filesToCommit.push({
          path: paths.full,
          content: img.fullBase64,
        });
        filesToCommit.push({
          path: paths.thumbnail,
          content: img.thumbBase64,
        });
      }
      
      const chunkInfo = body.commitChunkIndex !== undefined 
        ? ` (${body.commitChunkIndex + 1}/${body.commitTotalChunks})`
        : '';
      await commitMultipleFiles(filesToCommit, `Add ${body.commitImages.length} image(s)${chunkInfo}`);
      
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true, 
          imagesCommitted: body.commitImages.length,
          commitChunkIndex: body.commitChunkIndex,
        }),
      };
    }

    // Phase 3: Final deploy (just builds.json + rankings)
    if (body.finalDeploy) {
      const { pendingBuilds = [], pendingRankings, currentBuilds = [] } = body;
      if (pendingBuilds.some((build) => typeof build.id !== 'string' || !isValidBuildId(build.id))) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid build ID in deploy payload' }),
        };
      }
      const filesToCommit: Array<{ path: string; content: string }> = [];
      
      // Merge pending builds with current builds
      let finalBuilds = [...currentBuilds];
      
      for (const pending of pendingBuilds) {
        if (pending.isDeleted) {
          finalBuilds = finalBuilds.filter(b => b.id !== pending.id);
        } else if (pending.isNew) {
          finalBuilds.unshift(stripPendingFlags(pending));
        } else {
          const idx = finalBuilds.findIndex(b => b.id === pending.id);
          if (idx >= 0) {
            finalBuilds[idx] = stripPendingFlags(pending);
          } else {
            finalBuilds.push(stripPendingFlags(pending));
          }
        }
      }
      
      // Add builds.json
      filesToCommit.push({
        path: 'src/data/builds.json',
        content: Buffer.from(JSON.stringify(finalBuilds, null, 2)).toString('base64'),
      });
      
      // Add rankings if changed
      if (pendingRankings) {
        filesToCommit.push({
          path: 'src/data/rankings.json',
          content: Buffer.from(JSON.stringify(pendingRankings, null, 2) + '\n').toString('base64'),
        });
      }
      
      await commitMultipleFiles(filesToCommit, `Update ${pendingBuilds.length} build(s)`);
      
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
      body: JSON.stringify({ error: 'Invalid request - need processImages, commitImages, or finalDeploy' }),
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
