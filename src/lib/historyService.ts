import { supabase } from '@/lib/supabaseClient';

export interface HistoryEntry {
  id: string;
  question: string;
  answer: string;
  source_url: string | null;
  scheme: string | null;
  created_at: string;
}

export async function fetchHistory(): Promise<HistoryEntry[]> {
  const { data, error } = await supabase
    .from('question_history')
    .select('id, question, answer, source_url, scheme, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}

export async function saveHistory(entry: {
  question: string;
  answer: string;
  source_url: string | null;
  scheme: string | null;
}): Promise<void> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(
      `Session error: ${sessionError.message} (code: ${sessionError.name})`,
    );
  }

  if (!sessionData.session) {
    throw new Error('No authenticated session — sign in to save question history.');
  }

  const userId = sessionData.session.user.id;

  const { error } = await supabase.from('question_history').insert({
    user_id: userId,
    question: entry.question,
    answer: entry.answer,
    scheme: entry.scheme,
    source_url: entry.source_url,
  });

  if (error) {
    const detail = [
      `code: ${error.code ?? 'N/A'}`,
      `message: ${error.message ?? 'N/A'}`,
      `details: ${error.details ?? 'N/A'}`,
      `hint: ${error.hint ?? 'N/A'}`,
    ].join(', ');
    throw new Error(`Question history INSERT failed — ${detail}`);
  }
}
