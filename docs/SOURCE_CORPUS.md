# Official Source Corpus — Groww Mutual Fund Assistant V2

> **Important Distinction:**  
> This corpus documents the **23 official source URLs** providing regulatory and scheme facts for the five supported HDFC Mutual Fund schemes.  
> It is strictly distinguished from the **47 factual RAG chunks** (stored in Chroma Cloud collection `hdfc-mf-facts`), which represent individual granular facts extracted and embedded from these sources.

---

## Source Count Summary
- **Official Source URLs:** 23
- **Factual RAG Chunks:** 47
- **Target Schemes:** 5 HDFC Mutual Fund schemes + Regulatory/Statutory portals

---

## Catalog of 23 Official Source URLs

### 1. Scheme Information Documents & Key Information Memorandums (KIM / SID)
1. **HDFC Large Cap Fund KIM**  
   URL: `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Large%20Cap%20Fund%20dated%20November%2021%2C%202025_0.pdf`  
   Type: Regulatory KIM · Authority: Official AMC Document

2. **HDFC Flexi Cap Fund KIM**  
   URL: `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Flexi%20Cap%20Fund%20dated%20November%2021%2C%202025_1.pdf`  
   Type: Regulatory KIM · Authority: Official AMC Document

3. **HDFC ELSS Tax Saver KIM**  
   URL: `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20ELSS%20Tax%20Saver%20dated%20November%2021%2C%202025_0.pdf`  
   Type: Regulatory KIM · Authority: Official AMC Document

4. **HDFC Mid Cap Fund KIM**  
   URL: `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Mid%20Cap%20Fund%20dated%20November%2021%2C%202025_1.pdf`  
   Type: Regulatory KIM · Authority: Official AMC Document

5. **HDFC Balanced Advantage Fund KIM**  
   URL: `https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Balanced%20Advantage%20Fund%20dated%20November%2021%2C%202025_0.pdf`  
   Type: Regulatory KIM · Authority: Official AMC Document

6. **HDFC Large Cap Fund SID**  
   URL: `https://files.hdfcfund.com/s3fs-public/SID/2025-11/SID%20-%20HDFC%20Large%20Cap%20Fund%20dated%20November%2021%2C%202025.pdf`  
   Type: Statutory SID · Authority: Official AMC Document

7. **HDFC Flexi Cap Fund SID**  
   URL: `https://files.hdfcfund.com/s3fs-public/SID/2025-11/SID%20-%20HDFC%20Flexi%20Cap%20Fund%20dated%20November%2021%2C%202025.pdf`  
   Type: Statutory SID · Authority: Official AMC Document

8. **HDFC ELSS Tax Saver SID**  
   URL: `https://files.hdfcfund.com/s3fs-public/SID/2025-11/SID%20-%20HDFC%20ELSS%20Tax%20Saver%20dated%20November%2021%2C%202025.pdf`  
   Type: Statutory SID · Authority: Official AMC Document

9. **HDFC Mid Cap Fund SID**  
   URL: `https://files.hdfcfund.com/s3fs-public/SID/2025-11/SID%20-%20HDFC%20Mid%20Cap%20Fund%20dated%20November%2021%2C%202025.pdf`  
   Type: Statutory SID · Authority: Official AMC Document

10. **HDFC Balanced Advantage Fund SID**  
    URL: `https://files.hdfcfund.com/s3fs-public/SID/2025-11/SID%20-%20HDFC%20Balanced%20Advantage%20Fund%20dated%20November%2021%2C%202025.pdf`  
    Type: Statutory SID · Authority: Official AMC Document

---

### 2. Official HDFC Mutual Fund Scheme Pages
11. **HDFC Large Cap Fund Scheme Page**  
    URL: `https://www.hdfcfund.com/explore/mutual-funds/hdfc-large-cap-fund/regular`  
    Type: Web Portal · Authority: HDFC AMC

12. **HDFC Flexi Cap Fund Scheme Page**  
    URL: `https://www.hdfcfund.com/explore/mutual-funds/hdfc-flexi-cap-fund/direct`  
    Type: Web Portal · Authority: HDFC AMC

13. **HDFC ELSS Tax Saver Scheme Page**  
    URL: `https://www.hdfcfund.com/explore/mutual-funds/hdfc-elss-tax-saver-fund/direct`  
    Type: Web Portal · Authority: HDFC AMC

14. **HDFC Mid Cap Fund Scheme Page**  
    URL: `https://www.hdfcfund.com/explore/mutual-funds/hdfc-mid-cap-fund/direct`  
    Type: Web Portal · Authority: HDFC AMC

15. **HDFC Balanced Advantage Fund Scheme Page**  
    URL: `https://www.hdfcfund.com/explore/mutual-funds/hdfc-balanced-advantage-fund/direct`  
    Type: Web Portal · Authority: HDFC AMC

---

### 3. Statutory Disclosures & Service Portals
16. **HDFC Total Expense Ratio (TER) Disclosures**  
    URL: `https://www.hdfcfund.com/statutory-disclosure/total-expense-ratio-of-mutual-fund-schemes/reports`  
    Type: Statutory Disclosure · Authority: HDFC AMC

17. **HDFC Monthly Portfolio Disclosures**  
    URL: `https://www.hdfcfund.com/statutory-disclosure/portfolio/notices-portfolio`  
    Type: Statutory Disclosure · Authority: HDFC AMC

18. **HDFC Factsheet Directory**  
    URL: `https://www.hdfcfund.com/mutual-funds/factsheets`  
    Type: Official Factsheets · Authority: HDFC AMC

19. **HDFC Request Account Statement Service**  
    URL: `https://www.hdfcfund.com/services/additional-info/request-statement`  
    Type: Service Portal · Authority: HDFC AMC

---

### 4. Regulatory & Industry Bodies
20. **SEBI Master Circular for Mutual Funds**  
    URL: `https://www.sebi.gov.in/legal/master-circulars/mar-2026/master-circular-for-mutual-funds_100491.html`  
    Type: Regulatory Framework · Authority: SEBI (Securities and Exchange Board of India)

21. **SEBI Categorization and Rationalization Circular**  
    URL: `https://www.sebi.gov.in/legal/circulars/oct-2017/categorization-and-rationalization-of-mutual-fund-schemes_36199.html`  
    Type: Regulatory Framework · Authority: SEBI

22. **AMFI Scheme Details Directory**  
    URL: `https://www.amfiindia.com/otherdata/scheme-details`  
    Type: Industry Database · Authority: AMFI (Association of Mutual Funds in India)

---

### 5. Official NAV Source (Added in Task 1)
23. **HDFC Mutual Fund - NAV & IDCW**  
    URL: `https://www.hdfcfund.com/nav-and-idcw`  
    Type: Official Daily NAV Disclosure · Authority: HDFC AMC  
    Verified NAV Date: 25 Sep 2026  
    Supported Plan: Direct Plan - Growth Option (Chunks RAG043 - RAG047)
