import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { HandlerEvent } from '@netlify/functions';

// Rate limiting store (in-memory for serverless - resets on cold start)
// For production, consider using Netlify Blobs or external store
const rateLimitStore = new Map<string, { attempts: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRY = '24h';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { attempts: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: RATE_LIMIT_WINDOW };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetTime - now,
    };
  }

  record.attempts++;
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - record.attempts,
    resetIn: record.resetTime - now,
  };
}

export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}

export async function verifyPassword(password: string): Promise<boolean> {
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!storedHash) {
    console.error('ADMIN_PASSWORD_HASH not set');
    return false;
  }
  return bcrypt.compare(password, storedHash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export interface TokenPayload {
  admin: boolean;
  iat: number;
  exp: number;
}

export function createToken(): string {
  return jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getTokenFromEvent(event: HandlerEvent): string | null {
  // Check Authorization header
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Check cookie
  const cookieHeader = event.headers.cookie || event.headers.Cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith('admin_token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
  }

  return null;
}

export function createAuthCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  return `admin_token=${token}; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=Strict; Path=/; Max-Age=${24 * 60 * 60}`;
}

export function clearAuthCookie(): string {
  return 'admin_token=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0';
}

export function getClientIP(event: HandlerEvent): string {
  // Netlify provides client IP in headers
  return (
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export function isAuthenticated(event: HandlerEvent): boolean {
  const token = getTokenFromEvent(event);
  if (!token) return false;
  const payload = verifyToken(token);
  return payload !== null && payload.admin === true;
}
