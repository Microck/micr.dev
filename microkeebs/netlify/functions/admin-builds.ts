import { isAuthenticated } from './lib/auth.js';
import { getFileContent, createOrUpdateFile } from './lib/github.js';

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

export default async (request: Request) => {
  const url = new URL(request.url);
  const corsHeaders = {
    'Access-Control-Allow-Origin': url.origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Auth check for all non-OPTIONS requests
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
    // GET /builds - List all builds
    if (request.method === 'GET') {
      const file = await getFileContent(BUILDS_PATH);
      if (!file) {
        return new Response(
          JSON.stringify({ builds: [], sha: null }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const builds = JSON.parse(file.content) as KeyboardBuild[];
      return new Response(
        JSON.stringify({ builds, sha: file.sha }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // POST /builds - Create new build
    if (request.method === 'POST') {
      const body = await request.json() as { build: Partial<KeyboardBuild> };
      const { build } = body;

      if (!build.id || !build.title || !build.category) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: id, title, category' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Get current builds
      const file = await getFileContent(BUILDS_PATH);
      const builds: KeyboardBuild[] = file ? JSON.parse(file.content) : [];

      // Check for duplicate ID
      if (builds.some(b => b.id === build.id)) {
        return new Response(
          JSON.stringify({ error: 'Build with this ID already exists' }),
          {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
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

      return new Response(
        JSON.stringify({ build: newBuild, sha: result.sha }),
        {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // PUT /builds - Update existing build
    if (request.method === 'PUT') {
      const body = await request.json() as { build: KeyboardBuild; sha?: string };
      const { build, sha } = body;

      if (!build.id) {
        return new Response(
          JSON.stringify({ error: 'Build ID required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Get current builds
      const file = await getFileContent(BUILDS_PATH);
      if (!file) {
        return new Response(
          JSON.stringify({ error: 'Builds file not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const builds: KeyboardBuild[] = JSON.parse(file.content);
      const index = builds.findIndex(b => b.id === build.id);

      if (index === -1) {
        return new Response(
          JSON.stringify({ error: 'Build not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
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

      return new Response(
        JSON.stringify({ build, sha: result.sha }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // DELETE /builds?id=xxx - Delete build
    if (request.method === 'DELETE') {
      const buildId = url.searchParams.get('id');
      
      if (!buildId) {
        return new Response(
          JSON.stringify({ error: 'Build ID required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Get current builds
      const file = await getFileContent(BUILDS_PATH);
      if (!file) {
        return new Response(
          JSON.stringify({ error: 'Builds file not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const builds: KeyboardBuild[] = JSON.parse(file.content);
      const index = builds.findIndex(b => b.id === buildId);

      if (index === -1) {
        return new Response(
          JSON.stringify({ error: 'Build not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
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

      return new Response(
        JSON.stringify({ success: true, sha: result.sha }),
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
    console.error('Builds error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
