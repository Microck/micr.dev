import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { password } = body;

      if (!password) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Password required' }),
        };
      }

      if (password === ADMIN_PASSWORD) {
        const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true, token }),
        };
      }

      return {
        statusCode: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid password' }),
      };
    } catch {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid request' }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
