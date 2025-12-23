import { isAuthenticated } from './lib/auth.js';
import { commitMultipleFiles } from './lib/github.js';
import { processImage, validateImage, getImagePaths } from './lib/image.js';

export default async (request: Request) => {
  const url = new URL(request.url);
  const corsHeaders = {
    'Access-Control-Allow-Origin': url.origin,
    'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Auth check
  if (!isAuthenticated(request)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // POST /upload - Upload and process image
    if (request.method === 'POST') {
      const formData = await request.formData();
      const file = formData.get('image') as File | null;
      const buildId = formData.get('buildId') as string | null;
      const indexStr = formData.get('index') as string | null;

      if (!file || !buildId || indexStr === null) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: image, buildId, index' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const index = parseInt(indexStr, 10);
      if (isNaN(index) || index < 0) {
        return new Response(
          JSON.stringify({ error: 'Invalid index' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Read file as buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Validate image
      const validation = await validateImage(buffer);
      if (!validation.valid) {
        return new Response(
          JSON.stringify({ error: validation.error }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
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

      // Return the public path (relative to public/)
      const publicPath = paths.full.replace('public/', './');
      const thumbnailPath = paths.thumbnail.replace('public/', './');

      return new Response(
        JSON.stringify({
          success: true,
          path: publicPath,
          thumbnail: thumbnailPath,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // DELETE /upload?buildId=xxx&index=0 - Delete image
    if (request.method === 'DELETE') {
      const buildId = url.searchParams.get('buildId');
      const indexStr = url.searchParams.get('index');

      if (!buildId || indexStr === null) {
        return new Response(
          JSON.stringify({ error: 'Missing required params: buildId, index' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const index = parseInt(indexStr, 10);
      const paths = getImagePaths(buildId, index);

      // Delete both images from GitHub
      await commitMultipleFiles(
        [
          { path: paths.full, content: null },
          { path: paths.thumbnail, content: null },
        ],
        `Delete image: ${buildId}/${index === 0 ? 'thumbnail' : index}`
      );

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
