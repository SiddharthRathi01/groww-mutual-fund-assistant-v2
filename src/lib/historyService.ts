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

  const insertPayload = {
    user_id: userId,
    question: entry.question,
    answer: entry.answer,
    scheme: entry.scheme_code,
    source_url: entry.source_url,
  };

  console.log('[v0] Authenticated user_id immediately before question_history INSERT:', userId);
  console.log('[v0] question_history INSERT payload:', insertPayload);

  const { data: insertData, error: insertError } = await supabase
    .from('question_history')
    .insert(insertPayload)
    .select();

  console.log('[v0] question_history INSERT response data:', insertData);
  console.log('[v0] question_history INSERT response error.code:', insertError?.code);
  console.log('[v0] question_history INSERT response error.message:', insertError?.message);
  console.log('[v0] question_history INSERT response error.details:', insertError?.details);
  console.log('[v0] question_history INSERT response error.hint:', insertError?.hint);

  if (insertError) {
    throw new Error(`Unable to save question history: ${insertError.message}`);
  }
}
