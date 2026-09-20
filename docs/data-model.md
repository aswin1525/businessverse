# India BusinessVerse — Data Model & Entity Relationship Specification

## 1. Relational Entity Overview

The schema is built on a 12-table relational foundation centered around `companies` and anchored by `sources` to guarantee verifiable provenance.

```
                           ┌──────────────┐
                           │   sources    │
                           └──────┬───────┘
                                  │ 1
                                  │
                                  │ *
                ┌─────────────────┼────────────────────────┐
                │                 │                        │
                ▼                 ▼                        ▼
         ┌─────────────┐   ┌─────────────┐          ┌─────────────┐
         │  companies  │   │ financials  │          │relationships│
         └──────┬──────┘   └─────────────┘          └─────────────┘
                │
    ┌───────────┼───────────┬──────────────┬─────────────┐
    ▼           ▼           ▼              ▼             ▼
┌────────┐ ┌─────────┐ ┌─────────┐ ┌───────────────┐ ┌───────┐
│ events │ │products │ │services │ │  bs_segments  │ │locations
└────────┘ └─────────┘ └─────────┘ └───────────────┘ └───────┘
    │           │           │              │             │
    └───────────┴───────────┴──────────────┴─────────────┘
                                  │
                                  ▼
                           ┌──────────────┐
                           │  documents   │
                           └──────────────┘
```

---

## 2. Table Schemas

### 2.1 `sources`
Tracks the exact regulatory filing, official disclosure, or audited publication where data originated.
- `id` (UUID PK)
- `source_name` (VARCHAR(255), NOT NULL) — e.g., "NSE Audited Annual Filing FY24", "MCA V3 Master Record"
- `source_url` (TEXT, NOT NULL) — Official URL or regulatory portal permalink
- `source_type` (VARCHAR(50), NOT NULL) — `REGULATORY_FILING`, `ANNUAL_REPORT`, `OFFICIAL_DISCLOSURE`, `MCA_RECORD`, `OPEN_DATA`
- `publisher` (VARCHAR(150)) — e.g., "National Stock Exchange of India", "Ministry of Corporate Affairs"
- `published_at` (DATE) — Publication date
- `collected_at` (TIMESTAMPTZ, NOT NULL DEFAULT NOW()) — Ingestion timestamp
- `verification_status` (VARCHAR(50), NOT NULL DEFAULT 'VERIFIED') — `VERIFIED`, `PROVISIONAL`, `PENDING_REVIEW`
- `checksum` (VARCHAR(128)) — SHA-256 hash of original filing artifact
- `created_at` (TIMESTAMPTZ NOT NULL DEFAULT NOW())

### 2.2 `companies`
Core corporate profile entity.
- `id` (UUID PK)
- `cin` (VARCHAR(21) UNIQUE NOT NULL) — 21-character corporate identification number
- `name` (VARCHAR(255) NOT NULL) — Primary commercial display name (e.g., "Tata Motors")
- `legal_name` (VARCHAR(255) NOT NULL) — Registered legal entity name (e.g., "Tata Motors Limited")
- `nse_symbol` (VARCHAR(20) UNIQUE) — e.g., "TATAMOTORS"
- `bse_code` (VARCHAR(20) UNIQUE) — e.g., "500570"
- `status` (VARCHAR(50) NOT NULL DEFAULT 'ACTIVE') — `ACTIVE`, `AMALGAMATED`, `STRIKE_OFF`, `UNDER_LIQUIDATION`
- `company_class` (VARCHAR(50)) — `PUBLIC`, `PRIVATE`
- `category` (VARCHAR(100)) — `Company limited by shares`, etc.
- `registration_date` (DATE) — Incorporation date
- `registered_state` (VARCHAR(100)) — e.g., "Maharashtra"
- `headquarters_city` (VARCHAR(100)) — e.g., "Mumbai"
- `website` (VARCHAR(255))
- `listed_status` (VARCHAR(50) NOT NULL DEFAULT 'LISTED') — `LISTED`, `UNLISTED`
- `parent_company_id` (UUID, FK -> `companies.id`, NULLABLE) — Group holding or ultimate parent company
- `primary_source_id` (UUID, FK -> `sources.id`, NOT NULL)
- `created_at` (TIMESTAMPTZ NOT NULL DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ NOT NULL DEFAULT NOW())

### 2.3 `industries` & `company_industries`
- `industries`:
  - `id` (UUID PK)
  - `code` (VARCHAR(50) UNIQUE NOT NULL) — e.g., "AUTO_OEM", "IT_SERVICES", "BANK_PRIVATE"
  - `name` (VARCHAR(150) NOT NULL)
  - `sector` (VARCHAR(100) NOT NULL) — e.g., "Automotive", "Information Technology", "Financials"
  - `description` (TEXT)
  - `parent_industry_id` (UUID, FK -> `industries.id`, NULLABLE)
- `company_industries`:
  - `company_id` (UUID, FK -> `companies.id`)
  - `industry_id` (UUID, FK -> `industries.id`)
  - `is_primary` (BOOLEAN NOT NULL DEFAULT FALSE)
  - `source_id` (UUID, FK -> `sources.id`, NOT NULL)
  - PRIMARY KEY (`company_id`, `industry_id`)

### 2.4 `financials`
Time-series balance sheet and income statement metrics.
- `id` (UUID PK)
- `company_id` (UUID, FK -> `companies.id`, NOT NULL)
- `financial_year` (VARCHAR(10) NOT NULL) — e.g., "FY2024", "FY2023"
- `reporting_period` (VARCHAR(20) NOT NULL DEFAULT 'ANNUAL') — `ANNUAL`, `Q1`, `Q2`, `Q3`, `Q4`
- `period_start_date` (DATE NOT NULL)
- `period_end_date` (DATE NOT NULL)
- `currency` (VARCHAR(10) NOT NULL DEFAULT 'INR')
- `unit` (VARCHAR(20) NOT NULL DEFAULT 'CRORE') — Normalized to INR Crores
- `revenue` (NUMERIC(18,2)) — Total revenue from operations
- `net_profit` (NUMERIC(18,2)) — Profit after tax (PAT)
- `ebitda` (NUMERIC(18,2))
- `total_assets` (NUMERIC(18,2))
- `total_liabilities` (NUMERIC(18,2))
- `total_equity` (NUMERIC(18,2))
- `cash_and_equivalents` (NUMERIC(18,2))
- `total_debt` (NUMERIC(18,2))
- `eps` (NUMERIC(10,2)) — Earnings per share in INR
- `dividend_per_share` (NUMERIC(10,2))
- `market_cap` (NUMERIC(18,2)) — Market capitalization as of period end date
- `is_audited` (BOOLEAN NOT NULL DEFAULT TRUE)
- `source_id` (UUID, FK -> `sources.id`, NOT NULL)
- `notes` (TEXT)
- `created_at` (TIMESTAMPTZ NOT NULL DEFAULT NOW())

### 2.5 `relationships`
Knowledge graph edges connecting two companies.
- `id` (UUID PK)
- `source_company_id` (UUID, FK -> `companies.id`, NOT NULL)
- `target_company_id` (UUID, FK -> `companies.id`, NOT NULL)
- `relationship_type` (VARCHAR(50) NOT NULL) — `OWNS`, `OWNED_BY`, `SUBSIDIARY_OF`, `PARENT_OF`, `ACQUIRED`, `ACQUIRED_BY`, `MERGED_WITH`, `PARTNERED_WITH`, `INVESTED_IN`, `INVESTED_BY`, `COMPETES_WITH`, `SUPPLIER_OF`, `CUSTOMER_OF`, `JOINT_VENTURE`, `SAME_GROUP`, `OPERATES_IN`
- `effective_date` (DATE)
- `end_date` (DATE)
- `ownership_percentage` (NUMERIC(5,2)) — e.g., 51.00 for 51% stake
- `description` (TEXT)
- `is_active` (BOOLEAN NOT NULL DEFAULT TRUE)
- `source_id` (UUID, FK -> `sources.id`, NOT NULL)
- `created_at` (TIMESTAMPTZ NOT NULL DEFAULT NOW())

### 2.6 `company_events`
Chronological milestones.
- `id` (UUID PK)
- `company_id` (UUID, FK -> `companies.id`, NOT NULL)
- `event_type` (VARCHAR(50) NOT NULL) — `FOUNDED`, `IPO`, `ACQUISITION`, `MERGER`, `PARTNERSHIP`, `INVESTMENT`, `PRODUCT_LAUNCH`, `EXPANSION`, `REBRANDING`, `LEADERSHIP_CHANGE`, `OTHER`
- `event_date` (DATE NOT NULL)
- `title` (VARCHAR(255) NOT NULL)
- `description` (TEXT)
- `target_entity_name` (VARCHAR(255))
- `source_id` (UUID, FK -> `sources.id`, NOT NULL)
- `created_at` (TIMESTAMPTZ NOT NULL DEFAULT NOW())

### 2.7 `products`, `services`, `business_segments`, `locations`, `documents`
- `products`: Product catalogs with `launch_year` and `status`.
- `services`: Enterprise and consumer service lines.
- `business_segments`: Revenue contribution per business segment per fiscal year.
- `locations`: Physical coordinates (`latitude`, `longitude`), cities, and facility types (`HEADQUARTERS`, `MANUFACTURING`, `R_AND_D`, `DATA_CENTER`).
- `documents`: Regulatory PDFs and filings linked with full-text and metadata for AI embeddings.
