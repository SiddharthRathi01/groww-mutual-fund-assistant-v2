# Groww Mutual Fund Assistant V2

## Overview

**Groww Mutual Fund Assistant V2** is a facts-only mutual-fund FAQ assistant that provides concise factual information about five HDFC Mutual Fund schemes using verified official public sources.

**Facts-only. No investment advice.**

The system uses:
- Curated official public sources
- Chroma Cloud for RAG retrieval
- Server-side Google Gemini
- Deterministic investment-advice guardrails
- Supabase authentication
- User-specific question history

The assistant strictly adheres to regulatory compliance and does not provide investment recommendations, fund rankings, comparative performance analyses, or personalized investment advice.

---

## Live Application

The live application is accessible at:
[https://groww-mutual-fund-assistant-v2.ai.studio](https://groww-mutual-fund-assistant-v2.ai.studio)

---

## Key Features

- **Facts-Only Mutual Fund Q&A:** Delivers accurate, factual responses strictly grounded in verified documentation.
- **Five HDFC Mutual Fund Schemes:** Full coverage across large cap, flexi cap, ELSS, mid cap, and hybrid categories.
- **Verified Official-Source Grounding:** Direct attribution to official AMC KIMs, SIDs, statutory reports, and regulatory circulars.
- **Chroma Cloud RAG:** Cloud vector database retrieval over 47 verified factual chunks.
- **Server-Side Gemini Generation:** Grounded synthesis using Google GenAI SDK strictly restricted to retrieved context.
- **Investment-Advice Guardrails:** Deterministic classification refusing investment-advice and recommendation queries before vector search or LLM generation.
- **Email/Password Authentication:** User authentication powered by Supabase.
- **User-Specific Question History:** Persistent history of user inquiries, generated answers, scheme tags, and timestamps.
- **Supabase Row Level Security (RLS):** Database-enforced isolation ensuring users access only their own query history.
- **Source Links:** Direct hyperlinks to official regulatory documents and scheme portals.
- **Last-Updated Information:** Clear temporal metadata attached to verified factual answers.
- **Official Factsheet Access:** One-click navigation to monthly portfolio disclosures and AMC factsheet portals.
- **Scheme-Specific Context:** Filtered contextual queries tailored to the selected fund.
- **NAV Factual Retrieval:** Accurate Net Asset Value retrieval for all five supported schemes.
- **NAV Date:** Explicit attribution of the verified NAV date (as of 25 Sep 2026); never labeled as live or real-time.
- **Light/Dark Mode:** Seamless theme switching with persistent user preference.
- **Responsive UI:** Clean, intuitive interface optimized for desktop, tablet, and mobile displays.
- **Controlled Fallback:** Clean, non-hallucinating refusal when a requested fact is outside the verified knowledge base.

---

## Supported Schemes

1. **HDFC Large Cap Fund**
2. **HDFC Flexi Cap Fund**
3. **HDFC ELSS Tax Saver**
4. **HDFC Mid Cap Fund**
5. **HDFC Balanced Advantage Fund**

---

## Architecture

The end-to-end data flow operates sequentially:

```text
User
  ↓
Advice Guardrail
  ↓
Chroma Cloud RAG
  ↓
Server-side Gemini
  ↓
Verified Answer + Source
  ↓
Supabase Question History
```

Detailed architecture diagram:

```text
User Question
  │
  ▼
Advice Guardrail
  │
  ├── [Advice / Recommendation / Subjective] ──► Immediate Refusal (No RAG / No Gemini)
  │
  └── [Factual Query]
        │
        ▼
Chroma Cloud Retrieval (47 Factual Chunks)
        │
        ▼
Google Gemini (Server-side Synthesis)
        │
        ▼
Verified Answer + Source Attribution
        │
        ▼
Supabase Question History (Authenticated User Session)
```

### Component Roles & Responsibilities

- **Advice Guardrail:** Deterministically identifies and refuses investment-advice, recommendation, or comparative queries before querying Chroma or invoking Gemini.
- **Chroma Cloud:** Vector database that retrieves relevant factual chunks based on semantic embeddings and scheme filters.
- **Google Gemini:** Server-side Large Language Model that synthesizes grounded, natural-language answers strictly from retrieved context.
- **Supabase:** Manages user authentication and securely persists user-specific question and answer records.

> **CRITICAL ARCHITECTURAL DISTINCTION:**  
> - **Chroma Cloud** is the sole vector database and retrieval store for mutual-fund facts.  
> - **Google Gemini** is the synthesis engine; it is **NOT** the source of mutual-fund facts.  
> - **Supabase** stores user session history and accounts; mutual-fund facts are **NOT** stored in Supabase.

---

## RAG Knowledge Base

The verified knowledge base is composed of:
- **23 Official Source URLs**
- **47 Factual RAG Chunks**
- **Chroma Database:** `hdfc-mf-rag`
- **Chroma Collection:** `hdfc-mf-facts`

### Knowledge Coverage

The 47 granular chunks cover:
1. **Investment Objectives & Strategies:** Grounded in official Key Information Memorandums (KIM) and Scheme Information Documents (SID).
2. **Benchmark Indices:** Benchmark mappings verified from official scheme documents.
3. **Minimum SIP Amounts:** Minimum initial and monthly SIP investment thresholds.
4. **Exit Loads & Lock-in Periods:** Statutory lock-in (3 years for ELSS) and exit load percentage structures.
5. **Riskometer Levels:** AMC and regulatory risk classifications.
6. **Fund Managers:** Dedicated fund managers mapped to each scheme.
7. **Total Expense Ratios (TER):** Verified expense ratio disclosures.
8. **Net Asset Value (NAV):** Verified NAV values as of **25 Sep 2026** for Direct Plan - Growth Option across all five schemes.
9. **Regulatory & Statutory Portals:** Official links to SEBI master circulars, AMFI scheme directories, factsheet indices, and statement services.

### Grounding & Controlled Fallback Policy

- Answers must be directly and exclusively supported by the retrieved factual chunks.
- If the knowledge base does not contain the specific fact requested, the system returns a polite, controlled fallback:
  > *"I couldn't find that fact in the verified sources currently available to me."*
- The model never speculates, assumes, or hallucinates unverified plans or figures.

---

## Authentication & History

- **Authentication:** Supabase provides secure email/password account creation and session authentication.
- **Question History:** The `question_history` table stores user questions, generated answers, cited source URLs, scheme tags, and timestamps.
- **Row Level Security (RLS):** Supabase RLS policies enforce strict ownership rules (`auth.uid() = user_id`) for SELECT, INSERT, UPDATE, and DELETE operations.
- **Privacy Assurance:** The application never collects or stores sensitive financial PII (no PAN, bank account numbers, folio numbers, portfolio holdings, or transaction records).
- **Separation of Concerns:** Mutual-fund facts are never stored in Supabase; facts reside exclusively in Chroma Cloud.

---

## Environment Variables

The application requires the following environment variables:

```text
# Supabase Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Chroma Cloud Vector Database
CHROMA_API_KEY=
CHROMA_TENANT=
CHROMA_DATABASE=hdfc-mf-rag
CHROMA_COLLECTION=hdfc-mf-facts

# Google Gemini API
GEMINI_API_KEY=
```

> **Security Notice:** Secret keys (`CHROMA_API_KEY`, `GEMINI_API_KEY`, `CHROMA_TENANT`) are server-side secrets and must never be exposed to the client bundle or committed to public source control.

---

## Guardrails

The assistant strictly enforces regulatory and factual boundaries:
- **Refusal Before Generation:** Queries requesting investment advice, fund recommendations, performance predictions, or comparative ranking are intercepted immediately by server-side guardrails.
- **Concise Responses:** Verified factual answers are kept concise (maximum 3 sentences).
- **No Personal Financial Guidance:** The assistant clearly informs the user that it provides factual information only.

### Example Guardrail Refusal

**User:**  
*"Which HDFC fund will give me the highest return?"*

**Assistant:**  
*"I can provide factual information about these schemes, but I can't recommend or rank funds or provide investment advice."*

---

## Data Sources

All mutual-fund information is grounded in **23 official public sources** across:
- **HDFC Mutual Fund:** Official Scheme Pages, Key Information Memorandums (KIM), Scheme Information Documents (SID), Daily NAV & IDCW Portal, Total Expense Ratio (TER) Disclosures, and Factsheet Directories.
- **SEBI (Securities and Exchange Board of India):** Master Circular for Mutual Funds and Scheme Categorization Circulars.
- **AMFI (Association of Mutual Funds in India):** Official Scheme Details Directory.

For the comprehensive catalog and mapping matrix, see:
- [Source Corpus Catalog](docs/SOURCE_CORPUS.md)
- [Question-Source Matrix](docs/QUESTION_SOURCE_MATRIX.md)
- [Corpus QA Validation](docs/CORPUS_QA.md)
- [Sample Q&A](docs/SAMPLE_QA.md)

---

## Development

### Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend:** Node.js, Express 5, `@google/genai` (Google GenAI SDK), `chromadb` (Chroma Cloud Client), `@chroma-core/default-embed`
- **Database & Auth:** Supabase Auth, PostgreSQL with Row Level Security (RLS)

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the full-stack development server (Express server with Vite middleware on port 3000) |
| `npm run build` | Builds the production client bundle and bundles the Express server with esbuild |
| `npm start` | Starts the production server from `dist/server.cjs` on port 3000 |
| `npm run lint` | Runs ESLint validation across the repository |
| `npm run typecheck` | Runs TypeScript compiler type verification (`tsc --noEmit`) |

---

## Security & Compliance

- **Server-Side Secret Isolation:** `CHROMA_API_KEY`, `GEMINI_API_KEY`, and `CHROMA_TENANT` are exclusively accessed on the Node.js backend.
- **Supabase Row Level Security:** Enforces per-user query history isolation at the PostgreSQL layer.
- **Zero Financial PII:** Strict compliance policy prohibiting collection of PAN, bank credentials, folios, or transactions.
- **Production Query-Only Chroma Access:** Retrieval runs in read/query mode during normal operations.
- **Git Hygiene:** All environment credential files (`.env`, `.env.*`) are strictly git-ignored.

---

## QA / Verification

The following verification checks have been conducted and validated:
- **Chroma Cloud Connection:** Successfully connected to database `hdfc-mf-rag` and collection `hdfc-mf-facts`.
- **Chunk Ingestion & Validation:** 47 verified factual chunks queryable with 384-dimensional embeddings.
- **NAV Retrieval Across All 5 Schemes:** Verified as of 25 Sep 2026 for Direct Plan - Growth Option:
  - HDFC Large Cap Fund: ₹1,189.079 (RAG043)
  - HDFC Flexi Cap Fund: ₹2,214.572 (RAG044)
  - HDFC ELSS Tax Saver: ₹1,447.383 (RAG045)
  - HDFC Mid Cap Fund: ₹226.380 (RAG046)
  - HDFC Balanced Advantage Fund: ₹557.728 (RAG047)
- **Controlled Fallback:** Verified refusal without hallucination for unverified plans (e.g., Regular Plan IDCW).
- **Core Scheme Attributes:** Validated investment objectives, benchmarks, minimum SIP amounts, exit loads, and TER.
- **Investment-Advice Guardrail:** Validated deterministic refusal before vector search or model invocation.
- **Authentication & RLS:** Verified email/password login and user-isolated `question_history` table persistence.

---

## Disclaimer

> "Information is retrieved from verified HDFC Mutual Fund, SEBI and AMFI sources. This assistant provides factual information only and does not provide investment advice."
