import { supabase } from '@/lib/supabaseClient';

export interface HistoryEntry {
  id: string;
  question: string;
  answer: string;
  source_url: string | null;
  scheme_code: string | null;
  created_at: string;
}

export async function fetchHistory(): Promise<HistoryEntry[]> {
  const { data, error } = await supabase
    .from('question_history')
    .select('id, question, answer, source_url, scheme_code, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}

export async function saveHistory(entry: {
  question: string;
  answer: string;
  source_url: string | null;
  scheme_code: string | null;
}): Promise<void> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(`Unable to read the authenticated session: ${sessionError.message}`);
  }

  const userId = sessionData.session?.user.id;
  if (!userId) {
    throw new Error('No authenticated session — sign in to save question history.');
  }

  const { error: insertError } = await supabase.from('question_history').insert({
    user_id: userId,
    question: entry.question,
    answer: entry.answer,
    scheme_code: entry.scheme_code,
    source_url: entry.source_url,
  });

  if (insertError) {
    throw new Error(`Unable to save question history: ${insertError.message}`);
  }
}
