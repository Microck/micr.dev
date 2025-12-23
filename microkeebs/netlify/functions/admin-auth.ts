import {
  verifyPassword,
  createToken,
  createAuthCookie,
  clearAuthCookie,
  checkRateLimit,
  resetRateLimit,
  getClientIP,
  isAuthenticated,
} from './lib/auth.js';

export default async (request: Request) => {
  const url = new URL(request.url);
  const path = url.pathname.replace('/.netlify/functions/admin-auth', '');

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': url.origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // POST /login - Login with password
    if (request.method === 'POST' && (path === '/login' || path === '')) {
      const ip = getClientIP(request);
      const rateLimit = checkRateLimit(ip);

      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({
            error: 'Too many attempts',
            resetIn: Math.ceil(rateLimit.resetIn / 1000),
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
            },
          }
        );
      }

      const body = await request.json();
      const { password } = body as { password?: string };

      if (!password) {
        return new Response(
          JSON.stringify({ error: 'Password required', remaining: rateLimit.remaining }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const valid = await verifyPassword(password);

      if (!valid) {
        return new Response(
          JSON.stringify({
            error: 'Invalid password',
            remaining: rateLimit.remaining - 1,
          }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Success - reset rate limit and create token
      resetRateLimit(ip);
      const token = createToken();

      return new Response(
        JSON.stringify({ success: true, token }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Set-Cookie': createAuthCookie(token),
          },
        }
      );
    }

    // GET /verify - Verify current session
    if (request.method === 'GET' && path === '/verify') {
      if (isAuthenticated(request)) {
        return new Response(
          JSON.stringify({ authenticated: true }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ authenticated: false }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // POST /logout - Clear session
    if (request.method === 'POST' && path === '/logout') {
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Set-Cookie': clearAuthCookie(),
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
