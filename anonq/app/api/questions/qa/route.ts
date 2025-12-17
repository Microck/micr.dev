import { NextResponse } from 'next/server';
import { QuestionService } from '@/lib/data/questionService';

// Get all Q&A pairs
export async function GET() {
  try {
    const qa = await QuestionService.getAllQA();
    return NextResponse.json(qa);
  } catch (error) {
    console.error('Error fetching Q&A:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}