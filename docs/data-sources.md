# India BusinessVerse — Data Sources & Provenance Architecture

## 1. Provenance Integrity Mandate

India BusinessVerse operates under a non-negotiable rule: **Zero Synthetic Data in Core Entities**.

Every corporate fact (legal name, incorporation date, CIN, financial metric, equity ownership, partnership, or milestone) must resolve to an authoritative source record stored in the `sources` registry.

```
┌─────────────────────────────────────────────────────────────┐
│                       Data Provenance                       │
├───────────────────┬─────────────────────────────────────────┤
│ source_name       │ NSE Audited Financial Results (XBRL)    │
│ source_url        │ https://nsearchives.nseindia.com/...    │
│ publisher         │ National Stock Exchange of India        │
│ verification      │ VERIFIED                                │
│ checksum          │ 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b... │
└───────────────────┴─────────────────────────────────────────┘
```

---

## 2. Approved Authoritative Data Sources

### 2.1 Ministry of Corporate Affairs (MCA) / Government of India
- **Scope**: CIN master data, incorporation dates, registered office state, authorized capital, paid-up capital, company class, and listed status.
- **Protocol**: Bulk open data extracts and official MCA V3 public search API endpoints.
- **Verification**: CIN check algorithm (validation of 21-character alphanumeric structure).

### 2.2 National Stock Exchange of India (NSE)
- **Scope**: Listed corporate disclosures, official XBRL balance sheets, quarterly statements, annual audited reports, and shareholding patterns.
- **Protocol**: NSE Corporate Filings Portal and structured XBRL instance documents.
- **Verification**: Cross-referenced with statutory auditor certification.

### 2.3 Securities and Exchange Board of India (SEBI)
- **Scope**: Substantial acquisition of shares and takeovers (SAST disclosures), insider trading disclosures, prospectus, and rights issue filings.
- **Protocol**: SEBI EDGAR/public portal releases.
- **Verification**: Regulatory stamp and filing sequence verification.

### 2.4 Official Company Disclosures & Annual Reports
- **Scope**: Segmental revenue breakdowns, strategic acquisitions, global subsidiaries, R&D centers, and verified joint ventures.
- **Protocol**: Direct investor relations repositories.
- **Verification**: Audited financial statements sign-off by statutory audit firms.

---

## 3. Data Normalization & Ingestion Rules

1. **CIN Validation**:
   - Format: `[U/L][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}`
   - `L`: Listed; `U`: Unlisted.
   - Example: `L28920MH1945PLC004520` (Tata Motors Limited).
2. **Financial Normalization**:
   - Currency: All currency values are converted to standard `INR` base.
   - Unit: Stored in **Crores** (`₹ Cr`) with 2 decimal precision (`NUMERIC(18,2)`), representing 10,000,000 INR.
   - Reporting Periods: Standardized as `FY{YYYY}` (e.g., `FY2024` for period ending March 31, 2024).
3. **Missing Data Policy**:
   - Never interpolate missing balance sheet figures without explicitly flagging them as `ESTIMATED`.
   - If a metric is unreported by the company for a given year, it is preserved as `NULL` and displayed in the frontend as `"Data unavailable for this period"`.
4. **AI Separation Boundary**:
   - AI generated text or hypothetical scenarios generated in the Fusion Lab must never be persisted in primary corporate entity tables.
   - AI outputs carry distinct flags (`is_hypothetical: true`, `model_generated: true`) and are rendered in the UI with distinct violet badges.
