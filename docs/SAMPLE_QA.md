# Sample Q&A — Groww Mutual Fund Assistant V2

This sample set (8 questions) demonstrates the factual precision, NAV retrieval, source attribution, controlled fallback, and advice guardrails of the assistant.

---

### Question 1 (NAV — Large Cap)
**User:**
What is the NAV for HDFC Large Cap Fund?

**Assistant:**
The NAV of HDFC Large Cap Fund - Direct Plan - Growth Option was ₹1,189.079 as of 25 Sep 2026.

**Source Attribution:**
- Source: HDFC Mutual Fund - NAV & IDCW
- URL: `https://www.hdfcfund.com/nav-and-idcw`
- Last Updated: 2026-09-25

---

### Question 2 (NAV — Flexi Cap)
**User:**
What is the NAV for HDFC Flexi Cap Fund?

**Assistant:**
The NAV of HDFC Flexi Cap Fund - Direct Plan - Growth Option was ₹2,214.572 as of 25 Sep 2026.

**Source Attribution:**
- Source: HDFC Mutual Fund - NAV & IDCW
- URL: `https://www.hdfcfund.com/nav-and-idcw`
- Last Updated: 2026-09-25

---

### Question 3 (NAV — ELSS Tax Saver)
**User:**
What is the NAV for HDFC ELSS Tax Saver?

**Assistant:**
The NAV of HDFC ELSS - Tax Saver Fund - Direct Plan - Growth Option was ₹1,447.383 as of 25 Sep 2026.

**Source Attribution:**
- Source: HDFC Mutual Fund - NAV & IDCW
- URL: `https://www.hdfcfund.com/nav-and-idcw`
- Last Updated: 2026-09-25

---

### Question 4 (Factual Objective — Large Cap)
**User:**
What is the investment objective of HDFC Large Cap Fund?

**Assistant:**
The investment objective of HDFC Large Cap Fund is to provide long-term capital appreciation by investing predominantly in Large-Cap companies.

**Source Attribution:**
- Source: HDFC KIM
- URL: `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Large%20Cap%20Fund%20dated%20November%2021%2C%202025_0.pdf`
- Last Updated: 2025-11-21

---

### Question 5 (Factual Benchmark — Mid Cap)
**User:**
What is the benchmark of HDFC Mid Cap Fund?

**Assistant:**
The benchmark of HDFC Mid Cap Fund is the NIFTY MIDCAP 150 Total Return Index (TRI).

**Source Attribution:**
- Source: HDFC KIM
- URL: `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Mid%20Cap%20Fund%20dated%20November%2021%2C%202025_1.pdf`

---

### Question 6 (Factual Lock-In — ELSS)
**User:**
What is the lock-in period of HDFC ELSS Tax Saver?

**Assistant:**
HDFC ELSS Tax Saver has a statutory lock-in period of 3 years from the date of allotment.

**Source Attribution:**
- Source: HDFC KIM
- URL: `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20ELSS%20Tax%20Saver%20dated%20November%2021%2C%202025_0.pdf`

---

### Question 7 (Controlled Fallback — Unsupported Fact)
**User:**
What is the NAV of HDFC Large Cap Fund Regular IDCW Plan?

**Assistant:**
I couldn't find that fact in the verified sources currently available to me.

**Behavior:**
Controlled fallback; does not speculate or hallucinate unverified plans.

---

### Question 8 (Advice Guardrail Refusal)
**User:**
Which mutual fund is best for me to invest in for maximum returns?

**Assistant:**
I can provide factual information about these schemes, but I can't recommend or rank funds or provide investment advice.

**Behavior:**
Immediate refusal triggered deterministically before vector search and LLM generation.
