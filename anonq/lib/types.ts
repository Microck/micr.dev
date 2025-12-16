export interface Question {
  id: string;
  content: string;
  timestamp: Date;
  answered: boolean;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  timestamp: Date;
}

export interface QA {
  question: Question;
  answer: Answer;
}