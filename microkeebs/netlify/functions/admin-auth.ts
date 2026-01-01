import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import {
  verifyPassword,
  createToken,
  createAuthCookie,
  clearAuthCookie,
  checkRateLimit,
  resetRateLimit,
  getClientIP,
  verifyToken,
  getCorsHeaders,
} from './lib/auth';

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const corsHeaders = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/admin-auth', '');

  try {
    // POST /login - Login with password
    if (event.httpMethod === 'POST' && (path === '/login' || path === '')) {
      const ip = getClientIP(event);
      const rateLimit = checkRateLimit(ip);

      if (!rateLimit.allowed) {
        return {
          statusCode: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
          },
          body: JSON.stringify({
            error: 'Too many attempts',
            resetIn: Math.ceil(rateLimit.resetIn / 1000),
          }),
        };
      }

      const body = JSON.parse(event.body || '{}');
      const { password } = body as { password?: string };

      if (!password) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Password required', remaining: rateLimit.remaining }),
        };
      }

      const valid = await verifyPassword(password);

      if (!valid) {
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Invalid password',
            remaining: rateLimit.remaining - 1,
          }),
        };
      }

      // Success - reset rate limit and create token
      resetRateLimit(ip);
      const token = createToken();

      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Set-Cookie': createAuthCookie(token),
        },
        body: JSON.stringify({ success: true, token }),
      };
    }

    // GET /verify - Verify current session
    if (event.httpMethod === 'GET' && path === '/verify') {
      const authHeader = event.headers.authorization;
      const token = authHeader?.replace('Bearer ', '');
      
      if (token && verifyToken(token)) {
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ authenticated: true }),
        };
      }

      return {
        statusCode: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ authenticated: false }),
      };
    }

    // POST /logout - Clear session
    if (event.httpMethod === 'POST' && path === '/logout') {
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Set-Cookie': clearAuthCookie(),
        },
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
