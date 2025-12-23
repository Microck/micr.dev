import { isAuthenticated } from './lib/auth.js';
import { getFileContent, createOrUpdateFile } from './lib/github.js';

interface Rankings {
  all: string[];
  look: string[];
  sound: string[];
  feel: string[];
  mechanical: string[];
  electrocapacitive: string[];
}

const RANKINGS_PATH = 'src/data/rankings.json';

export default async (request: Request) => {
  const url = new URL(request.url);
  const corsHeaders = {
    'Access-Control-Allow-Origin': url.origin,
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
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
    // GET /rankings - Get all rankings
    if (request.method === 'GET') {
      const file = await getFileContent(RANKINGS_PATH);
      if (!file) {
        const emptyRankings: Rankings = {
          all: [],
          look: [],
          sound: [],
          feel: [],
          mechanical: [],
          electrocapacitive: [],
        };
        return new Response(
          JSON.stringify({ rankings: emptyRankings, sha: null }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const rankings = JSON.parse(file.content) as Rankings;
      return new Response(
        JSON.stringify({ rankings, sha: file.sha }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // PUT /rankings - Update rankings
    if (request.method === 'PUT') {
      const body = await request.json() as { rankings: Rankings; sha?: string };
      const { rankings, sha } = body;

      if (!rankings) {
        return new Response(
          JSON.stringify({ error: 'Rankings data required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Validate structure
      const requiredKeys: (keyof Rankings)[] = ['all', 'look', 'sound', 'feel', 'mechanical', 'electrocapacitive'];
      for (const key of requiredKeys) {
        if (!Array.isArray(rankings[key])) {
          return new Response(
            JSON.stringify({ error: `Invalid rankings: ${key} must be an array` }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }

      // Get current file for SHA
      const file = await getFileContent(RANKINGS_PATH);

      // Commit to GitHub
      const result = await createOrUpdateFile(
        RANKINGS_PATH,
        JSON.stringify(rankings, null, 2) + '\n',
        'Update rankings',
        sha || file?.sha
      );

      return new Response(
        JSON.stringify({ rankings, sha: result.sha }),
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
    console.error('Rankings error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
