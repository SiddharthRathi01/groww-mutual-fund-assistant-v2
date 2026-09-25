import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught unexpected component error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="card p-5 border border-red-200/80 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 text-center animate-fade-in space-y-3">
          <div className="inline-flex p-2.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
            <AlertTriangle size={20} strokeWidth={2} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {this.props.fallbackTitle || 'Something went wrong in this section'}
            </h4>
            <p className="text-xs text-muted mt-1 max-w-md mx-auto">
              An unexpected display issue occurred. You can retry without reloading the page.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 surface-2 border border-default hover:border-primary text-xs font-medium px-3.5 py-2 rounded-lg transition-colors"
            >
              <RefreshCw size={13} />
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
