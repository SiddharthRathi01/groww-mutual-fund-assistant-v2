import { createClient, type SupabaseClient, type User, type Session } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Normalizes the configured Supabase URL to the bare project URL (e.g. https://<project-ref>.supabase.co)
 * by stripping path suffixes such as /rest/v1 or /auth/v1, query parameters, or trailing slashes.
 */
function normalizeSupabaseUrl(urlString?: string): string | null {
  if (!urlString) return null;
  const trimmed = urlString.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    // parsed.origin extracts scheme + hostname + port, stripping any path like /rest/v1 or trailing slashes
    return parsed.origin;
  } catch {
    return null;
  }
}

const normalizedSupabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);
const isConfigured = Boolean(
  normalizedSupabaseUrl &&
  supabaseAnonKey &&
  supabaseAnonKey.trim().length > 0
);

interface MockStoredUser {
  id: string;
  email: string;
  password?: string;
  created_at: string;
}

interface MockHistoryRecord {
  id: string;
  question: string;
  answer: string;
  scheme: string | null;
  source_url: string | null;
  created_at: string;
  user_id?: string;
  [key: string]: unknown;
}

type AuthListener = (event: string, session: Session | null) => void;

function createMockSupabaseClient(): unknown {
  console.warn('[AI Studio] Supabase environment variables not configured. Using local mock storage for auth and history.');

  const AUTH_STORAGE_KEY = 'fundfacts_mock_session';
  const HISTORY_STORAGE_KEY = 'fundfacts_mock_history';
  const USERS_STORAGE_KEY = 'fundfacts_mock_users';

  const listeners = new Set<AuthListener>();

  const getStoredSession = (): Session | null => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  };

  const setStoredSession = (session: Session | null) => {
    try {
      if (session) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // Storage unavailable or quota exceeded
    }
  };

  const getStoredUsers = (): Record<string, MockStoredUser> => {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, MockStoredUser>) : {};
    } catch {
      return {};
    }
  };

  const getStoredHistory = (): MockHistoryRecord[] => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as MockHistoryRecord[]) : [];
    } catch {
      return [];
    }
  };

  const setStoredHistory = (history: MockHistoryRecord[]) => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Storage unavailable or quota exceeded
    }
  };

  return {
    auth: {
      getSession: async () => {
        const session = getStoredSession();
        return { data: { session }, error: null };
      },
      onAuthStateChange: (callback: AuthListener) => {
        listeners.add(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                listeners.delete(callback);
              },
            },
          },
        };
      },
      signUp: async ({ email, password }: { email: string; password: string }) => {
        const users = getStoredUsers();
        if (users[email]) {
          return { data: { user: null, session: null }, error: { message: 'User already exists with this email.' } };
        }
        const id = 'mock-user-' + Math.random().toString(36).substring(2, 9);
        const user = {
          id,
          email,
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          role: 'authenticated',
        } as unknown as User;

        users[email] = { id, email, password, created_at: new Date().toISOString() };
        try {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        } catch {
          // Ignore
        }

        const session = {
          access_token: 'mock-token-' + Date.now(),
          token_type: 'bearer',
          user,
          expires_in: 3600,
          refresh_token: 'mock-refresh',
        } as Session;

        setStoredSession(session);
        listeners.forEach((fn) => fn('SIGNED_IN', session));
        return { data: { user, session }, error: null };
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const users = getStoredUsers();
        const existing = users[email];
        if (!existing) {
          const id = 'mock-user-' + Math.random().toString(36).substring(2, 9);
          users[email] = { id, email, password, created_at: new Date().toISOString() };
          try {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
          } catch {
            // Ignore
          }
        } else if (existing.password && existing.password !== password) {
          return { data: { user: null, session: null }, error: { message: 'Invalid login credentials.' } };
        }

        const user = {
          id: users[email].id,
          email,
          created_at: users[email].created_at,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          role: 'authenticated',
        } as unknown as User;

        const session = {
          access_token: 'mock-token-' + Date.now(),
          token_type: 'bearer',
          user,
          expires_in: 3600,
          refresh_token: 'mock-refresh',
        } as Session;

        setStoredSession(session);
        listeners.forEach((fn) => fn('SIGNED_IN', session));
        return { data: { user, session }, error: null };
      },
      signOut: async () => {
        setStoredSession(null);
        listeners.forEach((fn) => fn('SIGNED_OUT', null));
        return { error: null };
      },
    },
    from: (table: string) => {
      if (table === 'question_history') {
        let entries = [...getStoredHistory()];
        let queryResultPromise: Promise<{ data: MockHistoryRecord[]; error: null }> | null = null;

        const queryBuilder = {
          select: () => {
            return queryBuilder;
          },
          order: (col: string, options?: { ascending?: boolean }) => {
            const asc = options?.ascending ?? true;
            entries.sort((a, b) => {
              const valA = String(a[col] ?? '');
              const valB = String(b[col] ?? '');
              if (valA < valB) return asc ? -1 : 1;
              if (valA > valB) return asc ? 1 : -1;
              return 0;
            });
            return queryBuilder;
          },
          limit: (n: number) => {
            entries = entries.slice(0, n);
            return queryBuilder;
          },
          insert: async (entry: Partial<MockHistoryRecord>) => {
            const all = getStoredHistory();
            const newRecord: MockHistoryRecord = {
              id: 'mock-hist-' + Math.random().toString(36).substring(2, 9),
              created_at: new Date().toISOString(),
              question: entry.question ?? '',
              answer: entry.answer ?? '',
              scheme: entry.scheme ?? null,
              source_url: entry.source_url ?? null,
              ...entry,
            };
            all.unshift(newRecord);
            setStoredHistory(all);
            return { data: newRecord, error: null };
          },
          then: (
            resolve: (val: { data: MockHistoryRecord[]; error: null }) => unknown,
            reject?: (err: unknown) => unknown
          ) => {
            if (!queryResultPromise) {
              queryResultPromise = Promise.resolve({ data: entries, error: null });
            }
            return queryResultPromise.then(resolve, reject);
          },
        };

        return queryBuilder;
      }

      return {
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
      };
    },
  };
}

export const supabase: SupabaseClient = isConfigured
  ? createClient(normalizedSupabaseUrl!, supabaseAnonKey!.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : (createMockSupabaseClient() as SupabaseClient);

