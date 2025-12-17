import { NextRequest, NextResponse } from 'next/server';
import { QuestionService } from '@/lib/data/questionService';
import { ApiService } from '@/lib/services/apiService';

const rateLimitStore = new Map<string, { count: number; lastReset: number }>();
const submitRateLimitStore = new Map<string, { count: number; lastReset: number }>();

function checkGeneralRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 100;

  const userLimit = rateLimitStore.get(ip);

  if (!userLimit || now - userLimit.lastReset > windowMs) {
    rateLimitStore.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

function checkSubmitRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxSubmissions = 5;

  const userLimit = submitRateLimitStore.get(ip);

  if (!userLimit || now - userLimit.lastReset > windowMs) {
    submitRateLimitStore.set(ip, { count: 1, lastReset: now });
    return { allowed: true };
  }

  if (userLimit.count >= maxSubmissions) {
    const retryAfter = Math.ceil((userLimit.lastReset + windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }

  userLimit.count++;
  return { allowed: true };
}

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] ||
         request.headers.get('x-real-ip') ||
         'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    if (!checkGeneralRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }

    const submitLimit = checkSubmitRateLimit(ip);
    if (!submitLimit.allowed) {
      return NextResponse.json(
        { error: `Too many questions submitted. Try again in ${Math.ceil((submitLimit.retryAfter || 0) / 60)} minutes.` },
        { status: 429, headers: { 'Retry-After': String(submitLimit.retryAfter) } }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question content is required' },
        { status: 400 }
      );
    }

    if (content.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Question must be less than 1000 characters' },
        { status: 400 }
      );
    }

    await QuestionService.addQuestion(content);

    try {
      const apiService = ApiService.getInstance();
      await apiService.sendNotification('New Anonymous Question', content);
    } catch {
    }

    return NextResponse.json(
      { message: 'Question submitted successfully' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const qa = await QuestionService.getAllQA();
    return NextResponse.json(qa);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}