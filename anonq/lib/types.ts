export interface Question {
  id: string;
  content: string;
  timestamp: Date | string;
  answered: boolean;
}

export interface Answer {
  id: string;
  question_id: string;
  content: string;
  timestamp: Date | string;
}

export interface QA {
  question: Question;
  answer: Answer;
}
