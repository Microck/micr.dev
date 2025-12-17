import { NextRequest, NextResponse } from 'next/server';
import { QuestionService } from '@/lib/data/questionService';
import { auth0, isAllowedUser } from '@/lib/auth0';

export async function GET() {
  const session = await auth0.getSession();
  if (!session || !isAllowedUser(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [questions, qa] = await Promise.all([
      QuestionService.getAllQuestions(),
      QuestionService.getAllQA()
    ]);
    return NextResponse.json({ questions, answered: qa });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session || !isAllowedUser(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }

    const deleted = await QuestionService.deleteQuestion(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
