import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { HandlerEvent } from '@netlify/functions';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://micr.dev',
  'https://www.micr.dev',
];

// In development, also allow localhost
if (process.env.NODE_ENV !== 'production') {
  ALLOWED_ORIGINS.push('http://localhost:5173', 'http://localhost:3000');
}

export function getCorsHeaders(event: HandlerEvent): Record<string, string> {
  const origin = event.headers.origin || event.headers.Origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Rate limiting store (in-memory for serverless - resets on cold start)
// For production, consider using Netlify Blobs or external store
const rateLimitStore = new Map<string, { attempts: number; resetTime: number; lockedUntil?: number }>();

// Strict rate limiting: 3 attempts per 30 minutes, 24 hour lockout after max attempts
const RATE_LIMIT_WINDOW = 30 * 60 * 1000; // 30 minutes
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 24 * 60 * 60 * 1000; // 24 hour lockout after exceeding attempts
const JWT_EXPIRY = '24h';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Check if IP is locked out
  if (record?.lockedUntil && now < record.lockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.lockedUntil - now,
    };
  }

  // Reset if window expired or was locked but lockout ended
  if (!record || now > record.resetTime || (record.lockedUntil && now >= record.lockedUntil)) {
    rateLimitStore.set(ip, { attempts: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: RATE_LIMIT_WINDOW };
  }

  // Check if max attempts exceeded - apply lockout
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION;
    return {
      allowed: false,
      remaining: 0,
      resetIn: LOCKOUT_DURATION,
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
  return jwt.sign({ admin: true }, getJwtSecret(), { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
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
