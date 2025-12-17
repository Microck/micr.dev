import { NextRequest, NextResponse } from 'next/server';
import { QuestionService } from '@/lib/data/questionService';
import { auth0, isAllowedUser } from '@/lib/auth0';

export async function POST(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session || !isAllowedUser(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { questionId, content } = body;

    if (!questionId || !content) {
      return NextResponse.json(
        { error: 'Question ID and content are required' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Answer content cannot be empty' },
        { status: 400 }
      );
    }

    if (content.trim().length > 2000) {
      return NextResponse.json(
        { error: 'Answer must be less than 2000 characters' },
        { status: 400 }
      );
    }

    const answer = await QuestionService.addAnswer(questionId, content);
    if (!answer) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Answer posted successfully' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
