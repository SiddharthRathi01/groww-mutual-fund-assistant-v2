import { CloudClient } from 'chromadb';
import { GoogleGenAI } from '@google/genai';

export interface RAGAnswerResponse {
  answer: string;
  sourceUrl: string;
  sourceName: string;
  lastUpdated?: string;
  isAnswered: boolean;
  isRefusal: boolean;
}

export interface SchemeQueryContext {
  code?: string;
  name?: string;
  category?: string;
  sourceUrl?: string;
}

const ADVICE_KEYWORDS = [
  'best fund',
  'which fund is best',
  'highest return',
  'highest returns',
  'safest fund',
  'should i invest',
  'should i buy',
  'should i choose',
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
  'investment advice',
  'financial advice',
  'give advice',
  'provide advice',
  'offer advice',
  'any advice',
  'need advice',
  'seeking advice',
  'advise me',
  'advise us',
  'advise on',
];

const ADVICE_PATTERNS = [
  /\binvestment\s+advice\b/i,
  /\bfinancial\s+advice\b/i,
  /\badvise\s+(?:me|us|someone|investors?)\b/i,
  /\badvise\s+on\b/i,
  /\b(?:can|could|will|would|do)\s+you\s+advise\b/i,
  /\b(?:give|giving|provide|providing|offer|offering)\s+(?:any\s+|some\s+|me\s+)?(?:investment\s+|financial\s+)?advice\b/i,
  /\b(?:any|need|want|seeking|get)\s+(?:investment\s+|financial\s+)?advice\b/i,
  /\bwhat\s+(?:investment\s+|financial\s+)?advice\b/i,
  /\badvice\s+(?:on|about|regarding)\b/i,
];

export function isAdviceQuestion(question: string): boolean {
  const q = question.toLowerCase();

  // Explicit safety check: questions about objective/strategy are always factual
  if (
    q.includes('investment objective') ||
    q.includes('objective of') ||
    q.includes('investment strategy') ||
    q.includes('strategy of')
  ) {
    return false;
  }

  if (ADVICE_KEYWORDS.some((kw) => q.includes(kw))) {
    return true;
  }

  return ADVICE_PATTERNS.some((pattern) => pattern.test(question));
}

let cachedChromaClient: CloudClient | null = null;
function getChromaClient(): CloudClient | null {
  const apiKey = process.env.CHROMA_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!cachedChromaClient) {
    cachedChromaClient = new CloudClient({
      apiKey,
      tenant: process.env.CHROMA_TENANT,
      database: process.env.CHROMA_DATABASE || 'hdfc-mf-rag',
    });
  }
  return cachedChromaClient;
}

let cachedGeminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!cachedGeminiClient) {
    cachedGeminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedGeminiClient;
}

const FALLBACK_NOT_FOUND_MESSAGE =
  "I couldn't find that fact in the verified sources currently available to me.";

export async function handleRAGQuery(
  question: string,
  scheme?: SchemeQueryContext
): Promise<RAGAnswerResponse> {
  // 1. Guardrail check first: immediate refusal without querying Chroma
  if (isAdviceQuestion(question)) {
    return {
      answer:
        "I can provide factual information about these schemes, but I can't recommend or rank funds or provide investment advice.",
      sourceUrl: scheme?.sourceUrl || '',
      sourceName: 'HDFC Mutual Fund',
      isAnswered: true,
      isRefusal: true,
    };
  }

  // 2. Query Chroma Cloud collection: hdfc-mf-facts
  const collectionName = process.env.CHROMA_COLLECTION || 'hdfc-mf-facts';
  const chroma = getChromaClient();

  if (!chroma) {
    console.warn('[RAG] CHROMA_API_KEY environment variable is not configured.');
    return {
      answer: FALLBACK_NOT_FOUND_MESSAGE,
      sourceUrl: scheme?.sourceUrl || '',
      sourceName: 'HDFC Mutual Fund',
      isAnswered: false,
      isRefusal: false,
    };
  }

  let retrievedDocs: string[] = [];
  let retrievedMetas: Record<string, unknown>[] = [];

  try {
    const collection = await chroma.getCollection({ name: collectionName });
    const queryText = scheme?.name ? `${scheme.name}: ${question}` : question;

    let queryResult;
    if (scheme?.name) {
      try {
        queryResult = await collection.query({
          queryTexts: [question],
          where: { scheme_or_scope: scheme.name },
          nResults: 8,
        });
      } catch {
        queryResult = null;
      }
    }

    // Fallback to broader query if scheme-filtered query yielded no documents
    if (!queryResult || !queryResult.documents?.[0] || queryResult.documents[0].length === 0) {
      queryResult = await collection.query({
        queryTexts: [queryText],
        nResults: 8,
      });
    }

    const docs = (queryResult.documents?.[0] || []).filter(
      (d): d is string => typeof d === 'string' && d.trim().length > 0
    );
    const metas = (queryResult.metadatas?.[0] || []) as Record<string, unknown>[];

    retrievedDocs = docs;
    retrievedMetas = metas;
  } catch (err) {
    console.error('[RAG] Error querying Chroma collection:', err);
    return {
      answer: FALLBACK_NOT_FOUND_MESSAGE,
      sourceUrl: scheme?.sourceUrl || '',
      sourceName: 'HDFC Mutual Fund',
      isAnswered: false,
      isRefusal: false,
    };
  }

  if (retrievedDocs.length === 0) {
    return {
      answer: FALLBACK_NOT_FOUND_MESSAGE,
      sourceUrl: scheme?.sourceUrl || '',
      sourceName: 'HDFC Mutual Fund',
      isAnswered: false,
      isRefusal: false,
    };
  }

  // Extract source metadata from retrieved chunks, prioritizing the chunk that matches the queried fact_type
  let sourceUrl = scheme?.sourceUrl || '';
  let sourceName = 'HDFC Mutual Fund';
  let lastUpdated: string | undefined = undefined;

  const qLower = question.toLowerCase();
  const matchingMeta = retrievedMetas.find((meta) => {
    if (!meta) return false;
    const ft = String(meta.fact_type || '').toLowerCase();
    return ft && qLower.includes(ft);
  }) || retrievedMetas[0];

  if (matchingMeta) {
    const url = (matchingMeta.source_url || matchingMeta.sourceUrl || matchingMeta.url) as string | undefined;
    if (url) {
      sourceUrl = url;
    }
    const name = (matchingMeta.source_name || matchingMeta.sourceName || matchingMeta.source) as string | undefined;
    if (name) {
      sourceName = name;
    }
    const updated = (matchingMeta.document_date_or_freshness ||
      matchingMeta.last_updated ||
      matchingMeta.updated_at ||
      matchingMeta.lastUpdated) as string | undefined;
    if (updated && updated !== 'current') {
      lastUpdated = updated;
    }
  }

  // 3. Server-side Gemini generation grounded strictly in retrieved chunks
  const gemini = getGeminiClient();
  if (!gemini) {
    console.warn('[RAG] GEMINI_API_KEY environment variable is not configured.');
    return {
      answer: FALLBACK_NOT_FOUND_MESSAGE,
      sourceUrl,
      sourceName,
      lastUpdated,
      isAnswered: false,
      isRefusal: false,
    };
  }

  const contextText = retrievedDocs
    .map((chunk, idx) => {
      const meta = retrievedMetas[idx] || {};
      const schemePart = meta.scheme_or_scope ? `Scheme / Scope: ${meta.scheme_or_scope}\n` : '';
      const factPart = meta.fact_type ? `Fact Type: ${meta.fact_type}\n` : '';
      const sourcePart = meta.source_name ? `Source: ${meta.source_name}\n` : '';
      return `[Verified Source Fact ${idx + 1}]\n${schemePart}${factPart}${sourcePart}Information: ${chunk}`;
    })
    .join('\n\n');

  const systemInstruction = `You are a factual mutual fund assistant for HDFC Mutual Fund.
Answer the user's question about the scheme strictly and solely using the verified context chunks provided below.
Do not guess, extrapolate, or use any outside knowledge or pre-trained assumptions not stated in the verified context.
If the retrieved context does not contain enough information to answer the question accurately, return exactly:
"I couldn't find that fact in the verified sources currently available to me."

Strict Response Guidelines:
- Maximum 3 sentences.
- Factual and concise only.
- Do not provide investment advice, fund recommendations, rankings, or return predictions.
- If the fact is not in the context, do not speculate.`;

  const prompt = `Selected Scheme: ${scheme?.name || 'HDFC Mutual Fund'} (Category: ${scheme?.category || 'General'})
User Question: ${question}

Verified Context:
${contextText}

Answer:`;

  try {
    // Ordered to prefer resilient models with available quota first
    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
      'gemini-flash-latest',
      'gemini-3.6-flash',
    ];

    let response = null;
    let lastError: unknown = null;

    for (const modelName of candidateModels) {
      // Try up to 2 attempts per model with backoff if experiencing transient 503 high demand
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await gemini.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.1,
            },
          });
          if (response && response.text) {
            break;
          }
        } catch (modelErr: unknown) {
          lastError = modelErr;
          const errMsg = modelErr instanceof Error ? modelErr.message : String(modelErr);
          const is503 = errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE');
          const is429 = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota');

          if (is503 && attempt === 0) {
            console.warn(`[RAG] Model ${modelName} returned 503 high demand on attempt 1, waiting 600ms before retry...`);
            await new Promise((resolve) => setTimeout(resolve, 600));
            continue;
          }

          if (is429) {
            // Immediate failover to candidate fallback model on quota limit without retry wait
            console.warn(`[RAG] Model ${modelName} quota reached (429), immediately failing over to next candidate model.`);
            break;
          }

          console.warn(`[RAG] Model ${modelName} attempt ${attempt + 1} failed: ${errMsg}`);
          break; // Move to next candidate model
        }
      }

      if (response && response.text) {
        break;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('All candidate Gemini models failed to respond.');
    }

    const answer = (response.text || '').trim();
    if (!answer || answer.includes("couldn't find that fact")) {
      return {
        answer: FALLBACK_NOT_FOUND_MESSAGE,
        sourceUrl,
        sourceName,
        lastUpdated,
        isAnswered: false,
        isRefusal: false,
      };
    }

    return {
      answer,
      sourceUrl,
      sourceName,
      lastUpdated,
      isAnswered: true,
      isRefusal: false,
    };
  } catch (err) {
    console.error('[RAG] Error calling Gemini API:', err);
    return {
      answer: FALLBACK_NOT_FOUND_MESSAGE,
      sourceUrl,
      sourceName,
      lastUpdated,
      isAnswered: false,
      isRefusal: false,
    };
  }
}
