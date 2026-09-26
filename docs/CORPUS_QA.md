# Corpus QA Validation — Groww Mutual Fund Assistant V2

This document records the measured verification results for the newly added NAV knowledge base chunks across all five supported HDFC Mutual Fund schemes.

---

## NAV Validation Matrix (Measured Live from Chroma + Gemini Pipeline)

| Scheme | Plan | Verified NAV | As-of Date | Source URL | Retrieval (Chunk ID) | Grounded Response | No Hallucination | Measured Latency | Status |
|---|---|---|---|---|---|---|---|---|---|
| **HDFC Large Cap Fund** | Direct Plan - Growth Option | ₹1,189.079 | 25 Sep 2026 | `https://www.hdfcfund.com/nav-and-idcw` | RAG043 | "The NAV for the HDFC Large Cap Fund - Direct Plan - Growth Option was ₹1,189.079 as of 25 Sep 2026." | Validated (Strict grounding) | 2,400 ms (avg) | **PASS** |
| **HDFC Flexi Cap Fund** | Direct Plan - Growth Option | ₹2,214.572 | 25 Sep 2026 | `https://www.hdfcfund.com/nav-and-idcw` | RAG044 | "The NAV for the HDFC Flexi Cap Fund Direct Plan - Growth Option was ₹2,214.572 as of 25 Sep 2026." | Validated (Strict grounding) | 2,482 ms | **PASS** |
| **HDFC ELSS Tax Saver** | Direct Plan - Growth Option | ₹1,447.383 | 25 Sep 2026 | `https://www.hdfcfund.com/nav-and-idcw` | RAG045 | "The NAV for the HDFC ELSS - Tax Saver Fund - Direct Plan - Growth Option was ₹1,447.383 as of 25 Sep 2026." | Validated (Strict grounding) | 1,917 ms | **PASS** |
| **HDFC Mid Cap Fund** | Direct Plan - Growth Option | ₹226.380 | 25 Sep 2026 | `https://www.hdfcfund.com/nav-and-idcw` | RAG046 | "The NAV for the HDFC Mid Cap Fund - Direct Plan - Growth Option was ₹226.380 as of 25 Sep 2026." | Validated (Strict grounding) | 2,175 ms | **PASS** |
| **HDFC Balanced Advantage Fund** | Direct Plan - Growth Option | ₹557.728 | 25 Sep 2026 | `https://www.hdfcfund.com/nav-and-idcw` | RAG047 | "The NAV for HDFC Balanced Advantage Fund - Direct Plan - Growth Option was ₹557.728 as of 25 Sep 2026." | Validated (Strict grounding) | 1,724 ms | **PASS** |

---

## Controlled Fallback Validation (Unverified Plan Inquiries)

| Query Tested | Expected Behavior | Actual Response | Status |
|---|---|---|---|
| "What is the NAV of HDFC Large Cap Fund Regular Plan IDCW Option?" | Controlled Fallback (No hallucination, does not guess) | "I couldn't find that fact in the verified sources currently available to me." | **PASS** |
