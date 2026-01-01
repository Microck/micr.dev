import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { isAuthenticated, getCorsHeaders } from './lib/auth';
import { getFileContent, createOrUpdateFile } from './lib/github';

interface Rankings {
  all: string[];
  look: string[];
  sound: string[];
  feel: string[];
  mechanical: string[];
  electrocapacitive: string[];
}

const RANKINGS_PATH = 'src/data/rankings.json';

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
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
    // GET /rankings - Get all rankings
    if (event.httpMethod === 'GET') {
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
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ rankings: emptyRankings, sha: null }),
        };
      }

      const rankings = JSON.parse(file.content) as Rankings;
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rankings, sha: file.sha }),
      };
    }

    // PUT /rankings - Update rankings
    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}') as { rankings: Rankings; sha?: string };
      const { rankings, sha } = body;

      if (!rankings) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Rankings data required' }),
        };
      }

      // Validate structure
      const requiredKeys: (keyof Rankings)[] = ['all', 'look', 'sound', 'feel', 'mechanical', 'electrocapacitive'];
      for (const key of requiredKeys) {
        if (!Array.isArray(rankings[key])) {
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: `Invalid rankings: ${key} must be an array` }),
          };
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

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rankings, sha: result.sha }),
      };
    }

    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Rankings error:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
