/*
# Rename question_history.scheme_code to scheme

## Purpose
Aligns the column name with the required schema spec for Groww Mutual Fund Assistant V2.
The existing column `scheme_code` is renamed to `scheme`. No data is lost —
existing rows keep their values. No other columns, constraints, or policies
are changed.

## Changes
- `question_history.scheme_code` → `question_history.scheme` (RENAME COLUMN)

## Security
- RLS remains enabled. All four existing policies (select/insert/update/delete)
  remain unchanged and still reference `user_id` with `auth.uid()`.

## Notes
1. This is a non-destructive rename — existing 3 rows keep their scheme values.
2. The `user_id` column default (`auth.uid()`) is unchanged.
3. No new tables, no schema changes beyond the column rename.
*/

ALTER TABLE question_history RENAME COLUMN scheme_code TO scheme;
