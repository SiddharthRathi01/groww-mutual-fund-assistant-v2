/*
# Create question_history table for Groww Mutual Fund Assistant

## Purpose
Stores each authenticated user's question-and-answer history for the
facts-only mutual fund FAQ assistant. Each row records a question the user
asked, the factual answer returned, the source URL cited, and a timestamp.

## New Tables
- `question_history`
  - `id` (uuid, primary key, auto-generated)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), references auth.users with ON DELETE CASCADE)
  - `question` (text, NOT NULL) — the user's question
  - `answer` (text, NOT NULL) — the factual answer returned
  - `source_url` (text) — URL of the official source cited
  - `scheme_code` (text) — code of the scheme the question was about
  - `created_at` (timestamptz, defaults to now())

## Security
- Row Level Security enabled on `question_history`.
- Four owner-scoped policies (SELECT, INSERT, UPDATE, DELETE), each restricted
  to `authenticated` and scoped by `auth.uid() = user_id`.
- The `user_id` column defaults to `auth.uid()` so inserts that omit it still
  satisfy the INSERT policy's WITH CHECK.

## Notes
1. No financial personal information (PAN, folio, bank, holdings, transactions) is stored.
2. Users can only access their own question history — never other users' rows.
3. Schema is intentionally minimal for this prototype.
*/

CREATE TABLE IF NOT EXISTS question_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  source_url text,
  scheme_code text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE question_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_history" ON question_history;
CREATE POLICY "select_own_history" ON question_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_history" ON question_history;
CREATE POLICY "insert_own_history" ON question_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_history" ON question_history;
CREATE POLICY "update_own_history" ON question_history FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_history" ON question_history;
CREATE POLICY "delete_own_history" ON question_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_question_history_user_created
  ON question_history(user_id, created_at DESC);