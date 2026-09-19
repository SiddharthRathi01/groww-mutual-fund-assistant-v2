import { useState, useEffect, useRef } from 'react';
import { X, Lock, Mail, UserPlus, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type Mode = 'signin' | 'signup';

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(null);
      setPassword('');
      setTimeout(() => emailRef.current?.focus(), 100);
    }
  }, [open, mode]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (mode === 'signup') {
      const { error } = await signUp(email, password);
      setLoading(false);
      if (error) {
        setError(error);
      } else {
        setSuccess('Account created. You are now signed in.');
        setTimeout(onClose, 1200);
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        setError(error);
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="surface relative w-full max-w-md rounded-2xl border border-default p-6 shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center pt-2 mb-5">
          <div className="icon-box w-12 h-12 bg-primary-soft border border-primary/15 mb-3">
            <Lock size={20} strokeWidth={1.75} className="text-primary" />
          </div>
          <h2 className="text-lg font-semibold mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-muted">
            {mode === 'signin'
              ? 'Sign in to access the FundFacts assistant.'
              : 'Sign up to start asking factual mutual fund questions.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              ref={emailRef}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full surface-2 border border-default rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 6 characters)"
              className="w-full surface-2 border border-default rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 animate-fade-in">
              {error}
            </p>
          )}

          {success && (
            <p className="text-xs text-primary bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 animate-fade-in">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary rounded-lg w-full py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : mode === 'signin' ? (
              <>
                <LogIn size={16} />
                Sign In
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Sign Up
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-xs text-muted hover:text-primary transition-colors"
          >
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>

        <p className="text-[11px] text-subtle text-center mt-4 leading-relaxed">
          FundFacts does not collect PAN, folio, bank, or financial details.
        </p>
      </div>
    </div>
  );
}
