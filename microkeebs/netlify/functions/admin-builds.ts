import type { Handler, HandlerEvent } from '@netlify/functions';
import { isAuthenticated, getCorsHeaders } from './lib/auth';
import { getFileContent, createOrUpdateFile } from './lib/github';
import { isValidBuildId } from './lib/image';

interface KeyboardBuild {
  id: string;
  title: string;
  youtubeTitle?: string;
  category: 'MX' | 'EC';
  timestamp: string;
  images: string[];
  youtubeUrl: string;
  specs: Record<string, string | undefined>;
}

const BUILDS_PATH = 'src/data/builds.json';

export const handler: Handler = async (event: HandlerEvent) => {
  const corsHeaders = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  // Auth check for all non-OPTIONS requests
  if (!isAuthenticated(event)) {
    return {
      statusCode: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    // GET /builds - List all builds
    if (event.httpMethod === 'GET') {
      const file = await getFileContent(BUILDS_PATH);
      if (!file) {
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ builds: [], sha: null }),
        };
      }

      const builds = JSON.parse(file.content) as KeyboardBuild[];
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ builds, sha: file.sha }),
      };
    }

    // POST /builds - Create new build
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}') as { build: Partial<KeyboardBuild> };
      const { build } = body;

      if (!build.id || !build.title || !build.category) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing required fields: id, title, category' }),
        };
      }

      if (!isValidBuildId(build.id)) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid build ID' }),
        };
      }

      // Get current builds
      const file = await getFileContent(BUILDS_PATH);
      const builds: KeyboardBuild[] = file ? JSON.parse(file.content) : [];

      // Check for duplicate ID
      if (builds.some(b => b.id === build.id)) {
        return {
          statusCode: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Build with this ID already exists' }),
        };
      }

      // Create new build with defaults
      const newBuild: KeyboardBuild = {
        id: build.id,
        title: build.title,
        youtubeTitle: build.youtubeTitle,
        category: build.category as 'MX' | 'EC',
        timestamp: build.timestamp || new Date().toISOString(),
        images: build.images || [],
        youtubeUrl: build.youtubeUrl || '',
        specs: build.specs || {},
      };

      // Add to beginning of array
      builds.unshift(newBuild);

      // Commit to GitHub
      const result = await createOrUpdateFile(
        BUILDS_PATH,
        JSON.stringify(builds, null, 2),
        `Add build: ${newBuild.title}`,
        file?.sha
      );

      return {
        statusCode: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ build: newBuild, sha: result.sha }),
      };
    }

    // PUT /builds - Update existing build
    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}') as { build: KeyboardBuild; sha?: string };
      const { build, sha } = body;

      if (!build.id || !build.title || !build.category) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing required fields: id, title, category' }),
        };
      }

      if (!['MX', 'EC'].includes(build.category)) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid category. Must be MX or EC' }),
        };
      }

      if (!isValidBuildId(build.id)) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid build ID' }),
        };
      }

      // Get current builds
      const file = await getFileContent(BUILDS_PATH);
      if (!file) {
        return {
          statusCode: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Builds file not found' }),
        };
      }

      const builds: KeyboardBuild[] = JSON.parse(file.content);
      const index = builds.findIndex(b => b.id === build.id);

      if (index === -1) {
        return {
          statusCode: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Build not found' }),
        };
      }

      // Update build
      builds[index] = build;

      // Commit to GitHub
      const result = await createOrUpdateFile(
        BUILDS_PATH,
        JSON.stringify(builds, null, 2),
        `Update build: ${build.title}`,
        sha || file.sha
      );

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ build, sha: result.sha }),
      };
    }

    // DELETE /builds?id=xxx - Delete build
    if (event.httpMethod === 'DELETE') {
      const buildId = event.queryStringParameters?.id;
      
      if (!buildId) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Build ID required' }),
        };
      }

      if (!isValidBuildId(buildId)) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid build ID' }),
        };
      }

      // Get current builds
      const file = await getFileContent(BUILDS_PATH);
      if (!file) {
        return {
          statusCode: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Builds file not found' }),
        };
      }

      const builds: KeyboardBuild[] = JSON.parse(file.content);
      const index = builds.findIndex(b => b.id === buildId);

      if (index === -1) {
        return {
          statusCode: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Build not found' }),
        };
      }

      const deletedBuild = builds[index];
      builds.splice(index, 1);

      // Commit to GitHub
      const result = await createOrUpdateFile(
        BUILDS_PATH,
        JSON.stringify(builds, null, 2),
        `Delete build: ${deletedBuild.title}`,
        file.sha
      );

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, sha: result.sha }),
      };
    }

    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Builds error:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
