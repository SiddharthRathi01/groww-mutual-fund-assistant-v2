import type { SchemeInfo } from '@/data/schemes';

export interface AnswerResult {
  answer: string;
  sourceUrl: string;
  sourceName: string;
  isAnswered: boolean;
  isRefusal: boolean;
}

/**
 * Mock answer engine — returns placeholder factual answers.
 *
 * ARCHITECTURE NOTE:
 * This module is the single integration point for the HDFC Mutual Fund RAG
 * backend. When the verified RAG backend is connected, replace the body of
 * `fetchAnswer` with a call to the backend (e.g. via a Supabase Edge Function
 * that proxies the RAG API). The function signature and return type should
 * remain unchanged so the rest of the app does not need modification.
 */

const SOURCE_NAMES: Record<string, string> = {
  hdfc: 'HDFC Mutual Fund',
  sebi: 'SEBI',
  amfi: 'AMFI',
};

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

const ADVICE_KEYWORDS = [
  'best fund',
  'which fund is best',
  'highest return',
  'highest returns',
  'safest fund',
  'should i invest',
  'which fund should',
  'recommend',
  'recommendation',
  'rank',
  'ranking',
  'predict',
  'prediction',
  'which is better',
  'compare funds',
  'which scheme is best',
  'best scheme',
  'top scheme',
  'which to invest',
];

function isAdviceQuestion(question: string): boolean {
  const q = question.toLowerCase();
  return ADVICE_KEYWORDS.some((kw) => q.includes(kw));
}

export async function fetchAnswer(question: string, scheme: SchemeInfo): Promise<AnswerResult> {
  await new Promise((r) => setTimeout(r, 700));

  if (isAdviceQuestion(question)) {
    return {
      answer:
        "I can provide factual information about these schemes, but I can't recommend or rank funds or provide investment advice.",
      sourceUrl: scheme.sourceUrl,
      sourceName: SOURCE_NAMES.hdfc,
      isAnswered: true,
      isRefusal: true,
    };
  }

  const q = question.toLowerCase();
  let answer = '';

  if (q.includes('objective')) {
    answer = `The investment objective of ${scheme.name} is to ${objectiveFor(scheme)}.`;
  } else if (q.includes('expense ratio') || q.includes('ter')) {
    answer = `The expense ratio (TER) of ${scheme.name} is published in the latest scheme factsheet. Please refer to the official HDFC Mutual Fund website for the current expense ratio, as it may vary based on the plan (Regular/Direct) and option (Growth/IDCW).`;
  } else if (q.includes('top holding') || q.includes('portfolio') || q.includes('holding')) {
    answer = `The top holdings of ${scheme.name} are published in the monthly factsheet on the official HDFC Mutual Fund website. The portfolio is updated monthly and includes the top equity and debt holdings with their respective weightages.`;
  } else if (q.includes('risk')) {
    answer = `As per SEBI's risk classification, ${scheme.name} is assigned a risk level based on its category. Please refer to the latest scheme information document and factsheet for the current riskometer rating.`;
  } else if (q.includes('benchmark')) {
    answer = `The benchmark for ${scheme.name} is ${benchmarkFor(scheme)}.`;
  } else if (q.includes('fund manager')) {
    answer = `The fund manager of ${scheme.name} is listed on the official scheme factsheet. Please refer to the latest factsheet on the HDFC Mutual Fund website for current fund manager details.`;
  } else if (q.includes('minimum investment') || q.includes('minimum sip') || q.includes('minimum lump')) {
    answer = `The minimum investment amount for ${scheme.name} is ₹5,000 as a lump sum and ₹500 for SIP, as per the latest scheme information document. Please verify current minimums on the official HDFC Mutual Fund website.`;
  } else if (q.includes('exit load')) {
    answer = `${scheme.name} has an exit load of 1% if units are redeemed within 15 days of allotment. No exit load applies after 15 days. Please refer to the latest scheme information document for current exit load details.`;
  } else if (q.includes('strategy') || q.includes('investment approach')) {
    answer = `${scheme.name} follows ${strategyFor(scheme)}.`;
  } else if (q.includes('category') || q.includes('type of fund')) {
    answer = `${scheme.name} falls under the category of ${scheme.category}.`;
  } else if (q.includes('lock') || q.includes('lock-in')) {
    if (scheme.category.includes('ELSS')) {
      answer = `${scheme.name} has a mandatory lock-in period of 3 years from the date of each investment, as it is a tax-saving scheme under Section 80C of the Income Tax Act.`;
    } else {
      answer = `${scheme.name} does not have a lock-in period. However, an exit load may apply for early redemption. Please refer to the scheme information document for details.`;
    }
  } else if (q.includes('tax') || q.includes('elss') || q.includes('80c')) {
    if (scheme.category.includes('ELSS')) {
      answer = `${scheme.name} is an Equity Linked Savings Scheme (ELSS) eligible for tax deduction under Section 80C of the Income Tax Act, subject to a lock-in period of 3 years.`;
    } else {
      answer = `${scheme.name} is not an ELSS scheme and does not qualify for Section 80C tax benefits. Please consult a tax advisor for tax implications of investing in this scheme.`;
    }
  } else {
    answer = `For the question "${question}", please refer to the official ${scheme.name} factsheet and scheme information document on the HDFC Mutual Fund website for verified factual details.`;
  }

  return {
    answer,
    sourceUrl: scheme.sourceUrl,
    sourceName: SOURCE_NAMES.hdfc,
    isAnswered: true,
    isRefusal: false,
  };
}

function objectiveFor(scheme: SchemeInfo): string {
  switch (scheme.category) {
    case 'Equity — Large Cap':
      return 'provide long-term capital appreciation by investing primarily in large-cap equity and equity-related instruments';
    case 'Equity — Flexi Cap':
      return 'provide long-term capital appreciation by investing across large-cap, mid-cap, and small-cap stocks with flexibility to shift allocations across market capitalizations';
    case 'Equity — ELSS':
      return 'provide long-term capital appreciation and tax benefits under Section 80C by investing primarily in equity and equity-related instruments, with a mandatory lock-in period of 3 years';
    case 'Equity — Mid Cap':
      return 'provide long-term capital appreciation by investing primarily in mid-cap equity and equity-related instruments';
    case 'Hybrid — Dynamic Asset Allocation':
      return 'provide capital appreciation and income by dynamically allocating between equity and debt instruments based on market conditions';
    default:
      return 'provide long-term capital appreciation through diversified investments';
  }
}

function benchmarkFor(scheme: SchemeInfo): string {
  switch (scheme.category) {
    case 'Equity — Large Cap':
      return 'Nifty 100 TRI';
    case 'Equity — Flexi Cap':
      return 'Nifty 500 TRI';
    case 'Equity — ELSS':
      return 'Nifty 500 TRI';
    case 'Equity — Mid Cap':
      return 'Nifty Midcap 150 TRI';
    case 'Hybrid — Dynamic Asset Allocation':
      return 'Nifty 50 Hybrid Composite Debt 65:35 Index';
    default:
      return 'the relevant market index';
  }
}

function strategyFor(scheme: SchemeInfo): string {
  switch (scheme.category) {
    case 'Equity — Large Cap':
      return 'a bottom-up stock selection approach focused on fundamentally strong large-cap companies with a long-term perspective';
    case 'Equity — Flexi Cap':
      return 'a flexible, research-driven approach that allocates across large-cap, mid-cap, and small-cap stocks based on market opportunities';
    case 'Equity — ELSS':
      return 'a diversified equity investment approach with a focus on long-term capital appreciation while providing tax benefits under Section 80C';
    case 'Equity — Mid Cap':
      return 'a research-driven approach to identify high-growth mid-cap companies with sustainable business models';
    case 'Hybrid — Dynamic Asset Allocation':
      return 'a dynamic asset allocation strategy that adjusts equity and debt exposure based on market valuations and conditions';
    default:
      return 'a diversified investment approach aligned with the fund category';
  }
}
