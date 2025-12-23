import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = process.env.GITHUB_REPO || '';
const BUILDS_PATH = 'microkeebs/src/data/builds.json';

async function githubRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res;
}

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const authHeader = event.headers.authorization;
  if (!authHeader) {
    return {
      statusCode: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      const res = await githubRequest(BUILDS_PATH);
      if (!res.ok) {
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ builds: [], sha: null }),
        };
      }
      const data = await res.json();
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      const builds = JSON.parse(content);
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ builds, sha: data.sha }),
      };
    }

    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const { build, sha } = body;

      const res = await githubRequest(BUILDS_PATH);
      const data = await res.json();
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      const builds = JSON.parse(content);
      
      const index = builds.findIndex((b: { id: string }) => b.id === build.id);
      if (index === -1) {
        return {
          statusCode: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Build not found' }),
        };
      }
      
      builds[index] = build;

      const updateRes = await githubRequest(BUILDS_PATH, {
        method: 'PUT',
        body: JSON.stringify({
          message: `Update build: ${build.title}`,
          content: Buffer.from(JSON.stringify(builds, null, 2)).toString('base64'),
          sha: sha || data.sha,
        }),
      });

      if (!updateRes.ok) {
        const err = await updateRes.json();
        return {
          statusCode: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Failed to update', details: err }),
        };
      }

      const result = await updateRes.json();
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ build, sha: result.content.sha }),
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
