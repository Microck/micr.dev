import { NextRequest, NextResponse } from 'next/server';
import { ApiService } from '@/lib/services/apiService';

// Rate limiting store (in-memory, in production use Redis)
const regenerateRateLimitStore = new Map<string, { count: number; lastReset: number }>();

// Check rate limit for regenerate (10/IP/15min) - API calls cost money
function checkRegenerateRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10;

  const userLimit = regenerateRateLimitStore.get(ip);

  if (!userLimit || now - userLimit.lastReset > windowMs) {
    regenerateRateLimitStore.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Get client IP
function getClientIP(request: NextRequest): string {
  const ip = (request as any).ip;
  return ip ||
         request.headers.get('x-forwarded-for')?.split(',')[0] ||
         request.headers.get('x-real-ip') ||
         'unknown';
}

// Regenerate message (grammar correction) - rate limited to protect API costs
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    if (!checkRegenerateRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many regeneration requests, please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (content.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Content must be less than 1000 characters' },
        { status: 400 }
      );
    }

    const apiService = ApiService.getInstance();
    const result = await apiService.correctGrammar(content);

    if (result.error) {
      console.warn('Grammar correction service unavailable:', result.error);
    }

    return NextResponse.json({ corrected: result.corrected });
  } catch (error) {
    console.error('Error regenerating message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}