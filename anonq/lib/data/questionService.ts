import { getSupabase } from '../supabase';
import { Question, Answer, QA } from '../types';

export class QuestionService {
  static async addQuestion(content: string): Promise<Question> {
    const { data, error } = await getSupabase()
      .from('questions')
      .insert({ content: content.trim() })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUnansweredQuestions(): Promise<Question[]> {
    const { data, error } = await getSupabase()
      .from('questions')
      .select('*')
      .eq('answered', false)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getAllQuestions(): Promise<Question[]> {
    const { data, error } = await getSupabase()
      .from('questions')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getQuestionById(id: string): Promise<Question | null> {
    const { data, error } = await getSupabase()
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  static async addAnswer(questionId: string, content: string): Promise<Answer | null> {
    const question = await this.getQuestionById(questionId);
    if (!question) return null;

    const { data: answer, error: answerError } = await getSupabase()
      .from('answers')
      .insert({ question_id: questionId, content: content.trim() })
      .select()
      .single();

    if (answerError) throw answerError;

    const { error: updateError } = await getSupabase()
      .from('questions')
      .update({ answered: true })
      .eq('id', questionId);

    if (updateError) throw updateError;

    return answer;
  }

  static async getAnswerByQuestionId(questionId: string): Promise<Answer | null> {
    const { data, error } = await getSupabase()
      .from('answers')
      .select('*')
      .eq('question_id', questionId)
      .single();

    if (error) return null;
    return data;
  }

  static async getAllQA(): Promise<QA[]> {
    const { data: questions, error: qError } = await getSupabase()
      .from('questions')
      .select('*')
      .eq('answered', true);

    if (qError) throw qError;

    const { data: answers, error: aError } = await getSupabase()
      .from('answers')
      .select('*');

    if (aError) throw aError;

    return (questions || [])
      .map(question => ({
        question,
        answer: (answers || []).find(a => a.question_id === question.id)!,
      }))
      .filter(qa => qa.answer)
      .sort((a, b) => new Date(b.answer.timestamp).getTime() - new Date(a.answer.timestamp).getTime());
  }

  static async deleteQuestion(id: string): Promise<boolean> {
    const { error } = await getSupabase()
      .from('questions')
      .delete()
      .eq('id', id);

    return !error;
  }
}
