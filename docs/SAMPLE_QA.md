# Sample Q&A — Groww Mutual Fund Assistant V2

This sample set (8 questions) demonstrates the broad factual capabilities, NAV retrieval, source attribution, controlled fallback, and advice guardrails of the assistant across 8 distinct categories.

---

### Question 1 (NAV)
**User:**
What is the current NAV of HDFC Large Cap Fund?

**Assistant:**
The NAV of HDFC Large Cap Fund (Direct Plan - Growth Option) was ₹1,189.079 as of 25 Sep 2026.

**Source Attribution:**
- Source: HDFC Mutual Fund - NAV & IDCW
- URL: `https://www.hdfcfund.com/nav-and-idcw`
- Last Updated: 2026-09-25

---

### Question 2 (Investment Objective)
**User:**
What is the investment objective of HDFC Flexi Cap Fund?

**Assistant:**
The investment objective of HDFC Flexi Cap Fund is to generate capital appreciation / income from a portfolio predominantly invested in equity and equity related instruments.

**Source Attribution:**
- Source: HDFC KIM
- URL: `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Flexi%20Cap%20Fund%20dated%20November%2021%2C%202025_1.pdf`
- Last Updated: 2025-11-21

---

### Question 3 (Fund Manager)
**User:**
Who is the fund manager of HDFC Mid Cap Fund?

**Assistant:**
The fund managers of HDFC Mid Cap Fund are Mr. Chirag Setalvad and Mr. Dhruv Muchhal.

**Source Attribution:**
- Source: HDFC scheme page
- URL: `https://www.hdfcfund.com/explore/mutual-funds/hdfc-mid-cap-fund/direct`

---

### Question 4 (Benchmark)
**User:**
What benchmark does HDFC Balanced Advantage Fund use?

**Assistant:**
HDFC Balanced Advantage Fund uses the NIFTY 50 Hybrid Composite Debt 50:50 Index as its benchmark.

**Source Attribution:**
- Source: HDFC scheme page
- URL: `https://www.hdfcfund.com/explore/mutual-funds/hdfc-balanced-advantage-fund/direct`

---

### Question 5 (Exit Load)
**User:**
Does HDFC ELSS Tax Saver have an exit load?

**Assistant:**
HDFC ELSS Tax Saver has an exit load of NIL. (Statutory lock-in period of 3 years applies from the date of allotment).

**Source Attribution:**
- Source: HDFC ELSS Tax Saver Fund official scheme page
- URL: `https://www.hdfcfund.com/explore/mutual-funds/hdfc-elss-tax-saver-fund/direct`

---

### Question 6 (Riskometer)
**User:**
What is the riskometer rating of HDFC Mid Cap Fund?

**Assistant:**
The riskometer rating of HDFC Mid Cap Fund is Very High.

**Source Attribution:**
- Source: HDFC scheme page
- URL: `https://www.hdfcfund.com/explore/mutual-funds/hdfc-mid-cap-fund/direct`

---

### Question 7 (Unsupported / Future Return)
**User:**
What return will HDFC Large Cap Fund give next year?

**Assistant:**
I couldn't find that fact in the verified sources currently available to me.

**Behavior:**
Controlled fallback; does not speculate, predict future returns, or hallucinate numbers.

---

### Question 8 (Investment Advice Refusal)
**User:**
Which HDFC mutual fund should I invest in?

**Assistant:**
I can provide factual information about these schemes, but I can't recommend or rank funds or provide investment advice.

**Behavior:**
Immediate advice refusal triggered deterministically before vector search and LLM generation.

