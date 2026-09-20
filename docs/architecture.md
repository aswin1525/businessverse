# India BusinessVerse — Architecture Specification

## 1. Executive Overview

India BusinessVerse is an enterprise-grade business intelligence and knowledge graph platform designed to visualize, interrogate, and simulate relationships between Indian companies.

The system is designed under a strict **Source Provenance First** paradigm. No financial metric, ownership link, or corporate event exists in the primary database without an explicit, verifiable reference to an official regulatory or audited source (e.g., Ministry of Corporate Affairs, NSE XBRL filings, SEBI filings, audited annual reports).

---

## 2. Multi-Tier System Topology

The platform is structured into five distinct, decoupled layers:

```
[ Authoritative Sources (MCA / NSE / SEBI / Filings) ]
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Data Ingestion & Provenance Layer (Python / data/)       │
│    - Raw document ingestion & checksum hashing               │
│    - Entity extraction, CIN resolution, XBRL parsing        │
│    - Currency & financial unit normalization (INR Crores)    │
│    - Staging into validated JSON / Parquet datasets         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Relational & Vector Persistence Layer (PostgreSQL)       │
│    - 12 Core relational entities (Companies, Financials,    │
│      Relationships, Events, Segments, etc.)                 │
│    - Strict Foreign Key integrity & audit timestamps        │
│    - pgvector extension for chunked corporate document RAG  │
│    - Dual-profile compatibility (H2 for dev / Postgres prod)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Core Enterprise API Layer (Spring Boot 3 / Java 17)      │
│    - Clean Domain-Driven Design (company, financial, etc.)  │
│    - Graph traversal & relationship query optimization       │
│    - Provenance payload attachment on all entity responses  │
│    - Actuator & health monitoring endpoints                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐     ┌──────────────────────────────┐
│ 4. AI & ML Analytics Service │     │ 5. Spatial UI & Visualization│
│    (Python / ml-service/)    │     │    (React + TS + Vite)       │
│ - Business DNA feature engine│     │ - Bloomberg/Spatial Dark UI  │
│ - Company clustering & sim   │     │ - D3.js Force Network Graph  │
│ - RAG source grounder        │     │ - Interactive 5Y/10Y metrics │
│ - Fusion Lab scenario gen    │     │ - Strict Factual vs AI flags │
└──────────────────────────────┘     └──────────────────────────────┘
```

---

## 3. Subsystem Breakdown

### 3.1 Frontend (`frontend/`)
- **Framework**: React 18+ with TypeScript and Vite.
- **Styling & Theme**: Vanilla Tailwind CSS with custom design tokens. High-contrast, near-black (`#06080F` and `slate-950`) space-grade theme with restrained semantic accents:
  - Cyan (`#06B6D4`): Relationships, Network edges, Graph nodes.
  - Emerald (`#10B981`): Financial performance, Revenue, Audited growth.
  - Violet (`#8B5CF6`): AI Analyst, Synthesis, Vector matching.
  - Amber (`#F59E0B`): Historical milestones, Timelines, Alerts.
  - Blue (`#3B82F6`): Technology, Segments, Infrastructure.
- **Interactive Visualization**:
  - **D3.js**: Force-directed simulation for company network graphs, link bundling, and path tracing.
  - **Canvas / WebGL**: Viewport-aware rendering for smooth 60fps graph exploration across 1,000+ nodes.
  - **Framer Motion**: Fluid spatial transitions, panel slide-overs, and micro-interactions.

### 3.2 Backend Service (`backend/`)
- **Framework**: Spring Boot 3.2.x on OpenJDK 17.
- **Architectural Pattern**: Domain-Driven Design (DDD) with package-by-feature organization:
  - `company`: Master entity, CIN resolution, legal status, listed tickers.
  - `financial`: Multi-period statements, balance sheet items, ratios.
  - `relationship`: Directed graph edges (ownership, subsidiary, customer, partner, JV).
  - `event`: Chronological corporate milestones.
  - `industry`: Multi-level taxonomy (Sector -> Industry -> Sub-industry).
  - `segment` & `product` & `service`: Operational breakdowns.
  - `document` & `source`: Uncompromising provenance tracking.
- **Persistence**: Spring Data JPA with Hibernate, configured for PostgreSQL with Flyway deterministic migrations. Dev profile provides an in-memory H2 fallback for instant developer startup.

### 3.3 Data Ingestion Pipeline (`data/`)
- Modular Python extraction scripts targeting MCA filings, NSE XBRL disclosures, and official annual reports.
- Every record ingested must obtain a foreign key to the `sources` table, recording its URL, publisher, date, and hash.
- Unit normalization engine: all financials convert to a unified base (INR Crores) while preserving original reported figures.

### 3.4 AI / ML & RAG Engine (`ml-service/`)
- **Business DNA**: A 9-dimensional quantitative feature vector (Industry Exposure, Digital Intensity, Capital Intensity, B2B/B2C, Geodistribution, Product Diversity, Recurring Revenue, Inorganic M&A Velocity, Solvency Health).
- **RAG Engine**: Sentence Transformers embedding chunked annual reports and SEBI disclosures into pgvector, generating responses strictly grounded with footnote citations.
- **Fusion Lab**: Algorithmic combinatorial engine modeling hypothetical joint-venture synergies between disparate corporate entities.

---

## 4. Key Architectural Decisions (ADRs)

| ADR ID | Title | Status | Rationale |
|---|---|---|---|
| ADR-001 | Relational + Adjacency Graph in PostgreSQL | Accepted | Allows transactional ACID integrity for financial metrics and source provenance, while indexed `source_company_id` and `target_company_id` provide sub-millisecond 2-hop graph traversals for 10,000 nodes without the overhead of maintaining an external Neo4j cluster in Phase 1. |
| ADR-002 | Mandatory Source FKs | Accepted | To permanently avoid hallucinated data, schema-level foreign keys prevent orphan financial or relationship records without an authorized provenance record. |
| ADR-003 | Dual Profile Backend (`dev` & `prod`) | Accepted | Permits instant local testing via H2 with zero external container dependencies, while running full PostgreSQL + Flyway in staging and production. |
| ADR-004 | Canvas/WebGL Acceleration for Graph | Accepted | Standard SVG DOM nodes lag when node counts exceed 500. A hybrid Canvas rendering pipeline guarantees 60fps interaction during pan/zoom. |
