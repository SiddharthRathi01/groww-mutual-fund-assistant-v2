# Groww Mutual Fund Assistant V2

## Overview
This repository contains **Groww Mutual Fund Assistant V2** (Prototype B). It is a facts-only mutual-fund FAQ assistant designed to provide verified, factual mutual-fund information for five HDFC Mutual Fund schemes. The assistant strictly adheres to regulatory and compliance boundaries and does not provide investment advice, fund recommendations, performance rankings, or return predictions.

### Prototypes Distinction
- **Prototype A:** Groww Mutual Fund Assistant
- **Prototype B:** Groww Mutual Fund Assistant V2

In **Version 2**, Supabase is employed as a supporting technology specifically for:
- Email/password user authentication
- User-specific question and answer history logging
- Row Level Security (RLS) ensuring strict per-user data isolation

## Features
- Facts-only mutual fund Q&A
- Five HDFC Mutual Fund schemes
- Verified official-source grounding
- Chroma Cloud RAG
- Server-side Gemini generation
- Supabase email/password authentication
- User-specific question history
- Row Level Security (RLS)
- Investment-advice guardrails
- Red visual treatment for refusal responses
- Source links and last-updated metadata when available
- Light/Dark mode

## Supported Schemes
1. HDFC Large Cap Fund
2. HDFC Flexi Cap Fund
3. HDFC ELSS Tax Saver
4. HDFC Mid Cap Fund
5. HDFC Balanced Advantage Fund

## Architecture

For **Version 2**, the end-to-end flow is:

```text
User → Advice Guardrail → Chroma Cloud RAG → Server-side Gemini → Verified Answer + Source → Supabase Question History
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
Chroma Cloud Retrieval
        │
        ▼
Gemini (server-side)
        │
        ▼
Verified Answer + Source
        │
        ▼
Supabase Question History
```

- **Advice questions are refused before Chroma/Gemini:** Queries seeking investment recommendations, comparative ratings, or subjective choices are caught immediately by server-side guardrails without invoking the vector database or LLM.
- **Factual questions retrieve verified chunks from Chroma:** The backend queries Chroma Cloud using vector similarity and scheme metadata to fetch grounded knowledge chunks.
- **Gemini receives only retrieved context:** Server-side Gemini is instructed to synthesize answers strictly and solely from the retrieved context chunks.
- **If the verified corpus does not contain the fact, the assistant does not guess:** The model explicitly returns a standard fallback response rather than extrapolating or hallucinating.
- **Supabase stores authenticated users' question history only:** Question and answer records are persisted for the signed-in user session.
- **Mutual-fund facts are NOT stored in Supabase:** Scheme knowledge chunks and embeddings reside exclusively in Chroma Cloud.

## RAG Configuration

Non-secret RAG configuration values:

```text
CHROMA_DATABASE=hdfc-mf-rag
CHROMA_COLLECTION=hdfc-mf-facts
```

- The Chroma collection contains 34 verified fact chunks covering scheme objectives, benchmarks, minimum SIP amounts, exit loads, riskometers, fund managers, and regulatory frameworks.
- Access to the Chroma collection is read/query-only.
- The collection is not modified or re-ingested by this application.
- Chroma credentials are kept strictly as server-side secrets.

## Authentication & History

- **Authentication:** Supabase provides email/password authentication for user accounts.
- **Question History:** The `question_history` table stores user-specific questions, generated answers, scheme tags, and timestamps.
- **Row Level Security (RLS):** Supabase RLS policies enforce access control so authenticated users can only view and insert their own interaction records.
- **Privacy Assurance:** The application does not collect PAN, folio numbers, bank details, portfolio holdings, or transaction information.

## Environment Variables

The application requires the following environment variable names:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
CHROMA_API_KEY
CHROMA_TENANT
CHROMA_DATABASE
CHROMA_COLLECTION
GEMINI_API_KEY
```

> **Security Notice:** Secret values (including `CHROMA_API_KEY` and `GEMINI_API_KEY`) must never be committed to GitHub or exposed to the client-side browser bundle.

## Guardrails

The assistant strictly enforces the following guardrails:
- Provides factual information only.
- Does not recommend, rank, compare, or predict returns.
- Refuses investment-advice questions before reaching external model APIs.
- Does not guess when verified context is insufficient.
- Keeps factual answers concise (maximum 3 sentences).

### Example Refusal:

**User:**
"Which HDFC fund will give me the highest return?"

**Assistant:**
"I can provide factual information about these schemes, but I can't recommend or rank funds or provide investment advice."

## Data Sources

The source corpus uses official public sources from:
- HDFC Mutual Fund
- SEBI
- AMFI

## Development

### Stack
- React
- TypeScript
- Vite
- Node.js / Express server
- Chroma Cloud
- Gemini / Google GenAI SDK
- Supabase
- Tailwind CSS

### Scripts

Run development server (Express backend + Vite middleware):
```bash
npm run dev
```

Typecheck TypeScript source files:
```bash
npm run typecheck
```

Run ESLint:
```bash
npm run lint
```

Build production client and server bundles:
```bash
npm run build
```

Start production server:
```bash
npm start
```

Preview static client bundle:
```bash
npm run preview
```

## Security

- **Server-Side Credentials:** Sensitive API keys (`CHROMA_API_KEY`, `GEMINI_API_KEY`, `CHROMA_TENANT`) reside on the Express server and are never delivered to the client.
- **Supabase RLS:** Row Level Security protects user question history at the database layer.
- **No Financial PII:** The application never collects or stores sensitive financial or personal data (no PAN, bank accounts, or folio numbers).
- **Read-Only Chroma Access:** Retrieval runs in read/query-only mode without write or modification operations.
- **Source Control Hygiene:** All secrets and environment files (`.env`, `.env.local`) are excluded from source control.

## QA / Verification

The following verification checks have been completed and tested:
- Chroma collection connection successful
- 34 documents available
- Chroma retrieval successfully tested
- HDFC Large Cap benchmark returned correctly
- HDFC Mid Cap minimum SIP returned correctly
- HDFC Balanced Advantage exit-load question tested successfully
- Generic investment-advice guardrail tested
- Investment objective factual question tested through RAG
- Supabase authentication verified
- Supabase question_history insertion verified

## Disclaimer

"Information is retrieved from verified HDFC Mutual Fund, SEBI and AMFI sources. This assistant provides factual information only and does not provide investment advice."

## Prototype

Prototype URL: To be published

## License

This project is an assignment/prototype project.
