import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@/lib/config';
import { createSession, createAuthResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const config = ConfigService.getInstance();
    const hashedPassword = config.getAdminPasswordHash();

    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = createSession();
    return createAuthResponse(token, { 
      success: true, 
      message: 'Login successful',
      token 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}