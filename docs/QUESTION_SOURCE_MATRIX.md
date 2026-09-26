# Question-Source Matrix — Groww Mutual Fund Assistant V2

This matrix maps user inquiry types across the five supported HDFC Mutual Fund schemes to their verified official sources and RAG knowledge chunks.

---

## 1. Scheme-Specific Question Mapping

| Scheme | Attribute / Question Type | Verified Source Title | Source URL | Primary Chunk ID |
|---|---|---|---|---|
| **HDFC Large Cap Fund** | Investment Objective | HDFC KIM | `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Large%20Cap%20Fund%20dated%20November%2021%2C%202025_0.pdf` | RAG001 |
| **HDFC Large Cap Fund** | Benchmark | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-large-cap-fund/regular` | RAG002 |
| **HDFC Large Cap Fund** | Minimum SIP | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-large-cap-fund/regular` | RAG003 |
| **HDFC Large Cap Fund** | Riskometer | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-large-cap-fund/regular` | RAG004 |
| **HDFC Large Cap Fund** | Fund Managers | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-large-cap-fund/regular` | RAG005, RAG034 |
| **HDFC Large Cap Fund** | Exit Load | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-large-cap-fund/regular` | RAG006 |
| **HDFC Large Cap Fund** | Expense Ratio (TER) | HDFC Scheme Page + TER Report | `https://www.hdfcfund.com/statutory-disclosure/total-expense-ratio-of-mutual-fund-schemes/reports` | RAG035 |
| **HDFC Large Cap Fund** | **NAV (Direct - Growth)** | **HDFC Mutual Fund - NAV & IDCW** | `https://www.hdfcfund.com/nav-and-idcw` | **RAG043** |
|---|---|---|---|---|
| **HDFC Flexi Cap Fund** | Investment Objective | HDFC KIM | `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Flexi%20Cap%20Fund%20dated%20November%2021%2C%202025_1.pdf` | RAG007 |
| **HDFC Flexi Cap Fund** | Benchmark | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-flexi-cap-fund/direct` | RAG008 |
| **HDFC Flexi Cap Fund** | Minimum SIP | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-flexi-cap-fund/direct` | RAG009 |
| **HDFC Flexi Cap Fund** | Riskometer | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-flexi-cap-fund/direct` | RAG010 |
| **HDFC Flexi Cap Fund** | Exit Load | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-flexi-cap-fund/direct` | RAG011 |
| **HDFC Flexi Cap Fund** | Fund Managers | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-flexi-cap-fund/direct` | RAG039 |
| **HDFC Flexi Cap Fund** | Expense Ratio (TER) | HDFC Scheme Page + TER Report | `https://www.hdfcfund.com/statutory-disclosure/total-expense-ratio-of-mutual-fund-schemes/reports` | RAG036 |
| **HDFC Flexi Cap Fund** | **NAV (Direct - Growth)** | **HDFC Mutual Fund - NAV & IDCW** | `https://www.hdfcfund.com/nav-and-idcw` | **RAG044** |
|---|---|---|---|---|
| **HDFC ELSS Tax Saver** | Investment Objective | HDFC KIM | `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20ELSS%20Tax%20Saver%20dated%20November%2021%2C%202025_0.pdf` | RAG012 |
| **HDFC ELSS Tax Saver** | Statutory Lock-in | HDFC KIM | `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20ELSS%20Tax%20Saver%20dated%20November%2021%2C%202025_0.pdf` | RAG013 |
| **HDFC ELSS Tax Saver** | Riskometer | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-elss-tax-saver-fund/direct` | RAG014 |
| **HDFC ELSS Tax Saver** | Minimum SIP | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-elss-tax-saver-fund/direct` | RAG015 |
| **HDFC ELSS Tax Saver** | Benchmark | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-elss-tax-saver-fund/direct` | RAG016 |
| **HDFC ELSS Tax Saver** | Exit Load | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-elss-tax-saver-fund/direct` | RAG032 |
| **HDFC ELSS Tax Saver** | Fund Managers | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-elss-tax-saver-fund/direct` | RAG040 |
| **HDFC ELSS Tax Saver** | Expense Ratio (TER) | HDFC Scheme Page + TER Report | `https://www.hdfcfund.com/statutory-disclosure/total-expense-ratio-of-mutual-fund-schemes/reports` | RAG017 |
| **HDFC ELSS Tax Saver** | **NAV (Direct - Growth)** | **HDFC Mutual Fund - NAV & IDCW** | `https://www.hdfcfund.com/nav-and-idcw` | **RAG045** |
|---|---|---|---|---|
| **HDFC Mid Cap Fund** | Investment Objective | HDFC KIM | `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Mid%20Cap%20Fund%20dated%20November%2021%2C%202025_1.pdf` | RAG018 |
| **HDFC Mid Cap Fund** | Benchmark | HDFC KIM | `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Mid%20Cap%20Fund%20dated%20November%2021%2C%202025_1.pdf` | RAG019 |
| **HDFC Mid Cap Fund** | Minimum SIP | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-mid-cap-fund/direct` | RAG020 |
| **HDFC Mid Cap Fund** | Riskometer | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-mid-cap-fund/direct` | RAG021 |
| **HDFC Mid Cap Fund** | Fund Managers | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-mid-cap-fund/direct` | RAG033 |
| **HDFC Mid Cap Fund** | Exit Load | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-mid-cap-fund/direct` | RAG042 |
| **HDFC Mid Cap Fund** | Expense Ratio (TER) | HDFC Scheme Page + TER Report | `https://www.hdfcfund.com/statutory-disclosure/total-expense-ratio-of-mutual-fund-schemes/reports` | RAG037 |
| **HDFC Mid Cap Fund** | **NAV (Direct - Growth)** | **HDFC Mutual Fund - NAV & IDCW** | `https://www.hdfcfund.com/nav-and-idcw` | **RAG046** |
|---|---|---|---|---|
| **HDFC Balanced Advantage Fund** | Investment Objective | HDFC KIM | `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Balanced%20Advantage%20Fund%20dated%20November%2021%2C%202025_0.pdf` | RAG022 |
| **HDFC Balanced Advantage Fund** | Benchmark | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-balanced-advantage-fund/direct` | RAG023 |
| **HDFC Balanced Advantage Fund** | Minimum SIP | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-balanced-advantage-fund/direct` | RAG024 |
| **HDFC Balanced Advantage Fund** | Riskometer | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-balanced-advantage-fund/direct` | RAG025 |
| **HDFC Balanced Advantage Fund** | Exit Load | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-balanced-advantage-fund/direct` | RAG026 |
| **HDFC Balanced Advantage Fund** | Fund Managers | HDFC Scheme Page | `https://www.hdfcfund.com/explore/mutual-funds/hdfc-balanced-advantage-fund/direct` | RAG041 |
| **HDFC Balanced Advantage Fund** | Expense Ratio (TER) | HDFC Scheme Page + TER Report | `https://www.hdfcfund.com/statutory-disclosure/total-expense-ratio-of-mutual-fund-schemes/reports` | RAG038 |
| **HDFC Balanced Advantage Fund** | **NAV (Direct - Growth)** | **HDFC Mutual Fund - NAV & IDCW** | `https://www.hdfcfund.com/nav-and-idcw` | **RAG047** |

---

## 2. Institutional & Statutory Mapping

| Scope | Subject / Fact | Source Title | Source URL | Primary Chunk ID |
|---|---|---|---|---|
| HDFC Mutual Fund | Account Statement Request | HDFC Request Statement | `https://www.hdfcfund.com/services/additional-info/request-statement` | RAG027 |
| HDFC Mutual Fund | Latest Factsheet Directory | HDFC Factsheet Index | `https://www.hdfcfund.com/mutual-funds/factsheets` | RAG028 |
| HDFC Mutual Fund | Portfolio Notices & Disclosures | HDFC Portfolio Disclosures | `https://www.hdfcfund.com/statutory-disclosure/portfolio/notices-portfolio` | RAG029 |
| SEBI Mutual Funds | Master Circular Framework | SEBI Master Circular | `https://www.sebi.gov.in/legal/master-circulars/mar-2026/master-circular-for-mutual-funds_100491.html` | RAG030 |
| AMFI | Scheme Details Directory Interface | AMFI Scheme Details | `https://www.amfiindia.com/otherdata/scheme-details` | RAG031 |
