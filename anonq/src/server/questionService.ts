import { Question, Answer, QA } from '../types';

// In-memory storage (in production, use a proper database)
let questions: Question[] = [];
let answers: Answer[] = [];

export class QuestionService {
  static addQuestion(content: string): Question {
    const question: Question = {
      id: Date.now().toString(),
      content: content.trim(),
      timestamp: new Date(),
      answered: false,
    };
    
    questions.push(question);
    return question;
  }

  static getUnansweredQuestions(): Question[] {
    return questions.filter(q => !q.answered);
  }

  static getAllQuestions(): Question[] {
    return questions;
  }

  static getQuestionById(id: string): Question | undefined {
    return questions.find(q => q.id === id);
  }

  static markAsAnswered(questionId: string): void {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      question.answered = true;
    }
  }

  static addAnswer(questionId: string, content: string): Answer | null {
    const question = questions.find(q => q.id === questionId);
    if (!question) return null;

    const answer: Answer = {
      id: Date.now().toString(),
      questionId,
      content: content.trim(),
      timestamp: new Date(),
    };

    answers.push(answer);
    this.markAsAnswered(questionId);
    return answer;
  }

  static getAnswerByQuestionId(questionId: string): Answer | undefined {
    return answers.find(a => a.questionId === questionId);
  }

  static getAllQA(): QA[] {
    return questions
      .filter(q => q.answered)
      .map(question => ({
        question,
        answer: answers.find(a => a.questionId === question.id)!,
      }))
      .sort((a, b) => b.answer.timestamp.getTime() - a.answer.timestamp.getTime());
  }
}