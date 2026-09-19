import type { SchemeInfo } from '@/data/schemes';

export interface AnswerResult {
  answer: string;
  sourceUrl: string;
  sourceName: string;
  lastUpdated?: string;
  isAnswered: boolean;
  isRefusal: boolean;
}

export interface ExampleQuestion {
  text: string;
  icon: 'target' | 'percent' | 'chart' | 'alert' | 'arrows';
  color: 'green' | 'blue' | 'purple' | 'amber' | 'teal';
}

const EXAMPLE_QUESTIONS: ExampleQuestion[] = [
  { text: 'What is the investment objective of this scheme?', icon: 'target', color: 'green' },
  { text: 'What is the expense ratio (TER) of this scheme?', icon: 'percent', color: 'blue' },
  { text: 'What is the benchmark of this scheme?', icon: 'chart', color: 'purple' },
  { text: 'What is the risk level of this scheme?', icon: 'alert', color: 'amber' },
  { text: 'What is the exit load of this scheme?', icon: 'arrows', color: 'teal' },
];

export function getExampleQuestions(): ExampleQuestion[] {
  return [...EXAMPLE_QUESTIONS];
}

const FALLBACK_NOT_FOUND_MESSAGE =
  "I couldn't find that fact in the verified sources currently available to me.";

/**
 * Sends the user question and selected scheme context to the server-side
 * verified RAG endpoint (/api/answer), which queries Chroma Cloud (collection: hdfc-mf-facts)
 * and generates grounded answers via Gemini.
 */
export async function fetchAnswer(question: string, scheme: SchemeInfo): Promise<AnswerResult> {
  try {
    const response = await fetch('/api/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question.trim(),
        scheme: {
          code: scheme.code,
          name: scheme.name,
          category: scheme.category,
          sourceUrl: scheme.sourceUrl,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        answer: errorData.answer || FALLBACK_NOT_FOUND_MESSAGE,
        sourceUrl: scheme.sourceUrl,
        sourceName: 'HDFC Mutual Fund',
        isAnswered: false,
        isRefusal: false,
      };
    }

    const data = await response.json();
    return {
      answer: data.answer || FALLBACK_NOT_FOUND_MESSAGE,
      sourceUrl: data.sourceUrl || scheme.sourceUrl,
      sourceName: data.sourceName || 'HDFC Mutual Fund',
      lastUpdated: data.lastUpdated,
      isAnswered: Boolean(data.isAnswered),
      isRefusal: Boolean(data.isRefusal),
    };
  } catch (error) {
    console.error('[answerEngine] Error calling RAG backend:', error);
    return {
      answer: FALLBACK_NOT_FOUND_MESSAGE,
      sourceUrl: scheme.sourceUrl,
      sourceName: 'HDFC Mutual Fund',
      isAnswered: false,
      isRefusal: false,
    };
  }
}
