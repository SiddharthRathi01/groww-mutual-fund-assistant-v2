import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { SchemeSelector } from '@/components/SchemeSelector';
import { ChatInterface } from '@/components/ChatInterface';
import { SchemeInfoBar } from '@/components/SchemeInfoBar';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { AuthModal } from '@/components/AuthModal';
import { QuestionHistory } from '@/components/QuestionHistory';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { SchemeInfo } from '@/data/schemes';

function Dashboard() {
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<SchemeInfo | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-app flex flex-col">
      <Header onAuthClick={() => setAuthOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6">
        {/* 1. What is this? — Hero with side-by-side features */}
        <ErrorBoundary fallbackTitle="Hero section error">
          <Hero />
        </ErrorBoundary>

        {/* 2. Ask your question — primary focal point */}
        {/* 3. Which scheme am I asking about? — scheme context */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 pb-6">
          {/* Left — scheme selector + question history */}
          <div className="space-y-4">
            <ErrorBoundary fallbackTitle="Scheme selector error">
              <SchemeSelector selected={selectedScheme} onSelect={setSelectedScheme} />
            </ErrorBoundary>
            {user && (
              <ErrorBoundary fallbackTitle="History display error">
                <QuestionHistory refreshKey={historyRefresh} />
              </ErrorBoundary>
            )}
          </div>

          {/* Right — assistant area */}
          <div className="space-y-4">
            {selectedScheme && (
              <ErrorBoundary fallbackTitle="Scheme info error">
                <SchemeInfoBar scheme={selectedScheme} />
              </ErrorBoundary>
            )}
            <ErrorBoundary fallbackTitle="Chat interface error">
              <ChatInterface
                selectedScheme={selectedScheme}
                onHistorySaved={() => setHistoryRefresh((n) => n + 1)}
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* 6. What are the limitations? — disclaimer at bottom */}
        <div className="pb-8">
          <DisclaimerBanner />
        </div>
      </main>

      <Footer />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </ThemeProvider>
  );
}
