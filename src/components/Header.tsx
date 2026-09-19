import { Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/Logo';

interface HeaderProps {
  onAuthClick: () => void;
}

export function Header({ onAuthClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <header className="surface border-b border-default sticky top-0 z-30 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div className="leading-tight">
            <h1 className="text-base font-bold tracking-tight">FundFacts</h1>
            <p className="text-[11px] text-muted hidden sm:block">Verified Mutual Fund Information</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="btn-ghost border border-default rounded-lg p-2"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="surface-2 border border-default rounded-lg px-3 py-2 text-sm font-medium truncate max-w-[140px]">
                {user.email}
              </div>
              <button
                onClick={signOut}
                className="btn-ghost border border-default rounded-lg p-2 hover:text-primary"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="btn-primary rounded-lg px-4 py-2 text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
