import { NextResponse } from 'next/server';
import { QuestionService } from '@/lib/data/questionService';
import { auth0, isAllowedUser } from '@/lib/auth0';

export async function GET() {
  const session = await auth0.getSession();
  if (!session || !isAllowedUser(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const questions = QuestionService.getUnansweredQuestions();
    return NextResponse.json(questions);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
