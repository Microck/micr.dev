import type { Handler, HandlerEvent } from '@netlify/functions';
import { isAuthenticated, getCorsHeaders } from './lib/auth';
import { commitMultipleFiles } from './lib/github';
import { processImage, validateImage, getImagePaths, isValidBuildId } from './lib/image';

export const handler: Handler = async (event: HandlerEvent) => {
  const corsHeaders = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  // Auth check
  if (!isAuthenticated(event)) {
    return {
      statusCode: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    // POST /upload - Upload and process image
    if (event.httpMethod === 'POST') {
      // Parse multipart form data manually (Netlify Functions doesn't have built-in formData)
      // For simplicity, we'll expect base64-encoded image in JSON body
      const body = JSON.parse(event.body || '{}') as {
        image: string; // base64
        buildId: string;
        index: number;
      };

      const { image, buildId, index } = body;

      if (!image || !buildId || index === undefined) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing required fields: image, buildId, index' }),
        };
      }

      if (!isValidBuildId(buildId)) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid build ID' }),
        };
      }

      if (typeof index !== 'number' || index < 0) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid index' }),
        };
      }

      // Decode base64 image
      const buffer = Buffer.from(image, 'base64');

      // Validate image
      const validation = await validateImage(buffer);
      if (!validation.valid) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: validation.error }),
        };
      }

      // Process image
      const processed = await processImage(buffer);
      const paths = getImagePaths(buildId, index);

      // Upload both images to GitHub
      await commitMultipleFiles(
        [
          { path: paths.full, content: processed.full.toString('base64') },
          { path: paths.thumbnail, content: processed.thumbnail.toString('base64') },
        ],
        `Add image: ${buildId}/${index === 0 ? 'thumbnail' : index}`
      );

      // Return the public path relative to the app public directory.
      const publicPath = paths.full.replace('public/', './');
      const thumbnailPath = paths.thumbnail.replace('public/', './');

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          path: publicPath,
          thumbnail: thumbnailPath,
        }),
      };
    }

    // DELETE /upload?buildId=xxx&index=0 - Delete image
    if (event.httpMethod === 'DELETE') {
      const buildId = event.queryStringParameters?.buildId;
      const indexStr = event.queryStringParameters?.index;

      if (!buildId || indexStr === undefined) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing required params: buildId, index' }),
        };
      }

      const index = parseInt(indexStr, 10);
      if (!isValidBuildId(buildId) || !Number.isInteger(index) || index < 0) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid buildId or index' }),
        };
      }
      const paths = getImagePaths(buildId, index);

      // Delete both images from GitHub
      await commitMultipleFiles(
        [
          { path: paths.full, content: null },
          { path: paths.thumbnail, content: null },
        ],
        `Delete image: ${buildId}/${index === 0 ? 'thumbnail' : index}`
      );

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
