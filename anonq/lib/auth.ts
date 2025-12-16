import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

const sessions = new Map<string, { expiresAt: number }>();

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return process.env.ADMIN_PASSWORD_HASH || 'insecure-fallback-secret';
  }
  return secret;
}

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(token)
    .digest('hex');
}

export function createSession(): string {
  const token = generateSessionToken();
  const hashedToken = hashToken(token);
  
  sessions.set(hashedToken, {
    expiresAt: Date.now() + SESSION_DURATION_MS,
  });
  
  cleanupExpiredSessions();
  
  return token;
}

export function validateSession(token: string): boolean {
  if (!token) return false;
  
  const hashedToken = hashToken(token);
  const session = sessions.get(hashedToken);
  
  if (!session) return false;
  if (session.expiresAt < Date.now()) {
    sessions.delete(hashedToken);
    return false;
  }
  
  return true;
}

export function invalidateSession(token: string): void {
  const hashedToken = hashToken(token);
  sessions.delete(hashedToken);
}

function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token);
    }
  }
}

export async function getSessionFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return sessionCookie?.value || null;
}

export function createAuthResponse(token: string, data: object): NextResponse {
  const response = NextResponse.json(data);
  
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION_MS / 1000,
    path: '/',
  });
  
  return response;
}

export function createLogoutResponse(): NextResponse {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  
  return response;
}

export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const token = await getSessionFromRequest(request);
  
  if (!token || !validateSession(token)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return null;
}
