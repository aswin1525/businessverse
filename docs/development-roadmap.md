# India BusinessVerse — Master Development Roadmap

This roadmap documents the 10-phase engineering trajectory for India BusinessVerse, taking it from architectural inception to an enterprise-grade AI knowledge platform.

---

## 🗺️ Phases Overview

```
Phase 1: Foundation (Current)
   │
   ▼
Phase 2: Real Indian Company Data Ingestion (Top 100-200 Companies)
   │
   ▼
Phase 3: Company Explorer & Cockpit UI
   │
   ▼
Phase 4: Financial Analytics Engine (5Y/10Y/MAX Time Series)
   │
   ▼
Phase 5: Business Network Graph Visualization (D3 Force / Canvas)
   │
   ▼
Phase 6: Business DNA & Explainable Feature Vectors
   │
   ▼
Phase 7: AI Analyst & Provenance-Grounded RAG
   │
   ▼
Phase 8: Fusion Lab (Hypothetical Multi-Company Simulation)
   │
   ▼
Phase 9: 3D Universe Spatial View (Three.js / React Three Fiber)
   │
   ▼
Phase 10: Performance Optimization, Production Hardening & Deployment
```

---

## Detailed Phase Breakdown

### Phase 1: Architecture & Foundation (Current Scope)
- [x] Master system architecture & database ER design.
- [x] Documentation specifications (`architecture.md`, `data-model.md`, `data-sources.md`, `development-roadmap.md`).
- [x] Spring Boot 3 Java backend skeleton with health, readiness, JPA configuration, and Flyway SQL migrations (`V1__initial_schema.sql`).
- [x] React + TypeScript + Vite + Tailwind frontend foundation:
  - Dark spatial design system tokens and typography.
  - Reusable primitives: `Button`, `Input`, `Panel`, `Metric`, `Badge`, `AppNavigation`.
  - Polished interactive Business Universe landing shell with clearly marked prototype simulation.
- [x] Environment configuration (`.env.example`, `.gitignore`, `README.md`).

### Phase 2: Real Indian Company Ingestion Pipeline
- Ingestion scripts for initial 100–200 top Indian enterprise groups (Tata, Reliance, Adani, HDFC, Infosys, Wipro, Mahindra, Larsen & Toubro, etc.).
- Provenance engine: Automatic linking of MCA master data and NSE XBRL filings with cryptographic checksums.
- Entity resolution and bidirectional relationship population (`OWNS`, `SUBSIDIARY_OF`, `PARTNERED_WITH`, `ACQUIRED`).

### Phase 3: Company Profile Cockpit
- Real-time company profile view with executive metrics, headquarters geo-coordinates, listed tickers, and corporate status.
- Horizontal chronological timeline of verified corporate milestones.
- Segmental revenue and product/service breakdown.

### Phase 4: Financial Analytics & Time Series Engine
- Interactive 5Y, 10Y, and MAX financial charts (Revenue, PAT, EBITDA, Total Debt, Market Cap, EPS).
- Hover-activated provenance cards displaying exact filing source, filing date, and auditor notes.
- Explicit indicators for unavailable historical reporting periods.

### Phase 5: Business Network Graph Visualization
- D3.js force-directed network simulation with interactive node selection.
- Path tracing (finding relationships connecting Company A to Company B).
- Dynamic filters: Filter by industry sector, relationship type, and holding threshold.
- Contextual slide-over company dossier panel.

### Phase 6: Business DNA & Explainability
- Quantitative 9-dimension radar calculation (Digital Intensity, Capital Intensity, B2B/B2C, Geodistribution, etc.).
- "Why is this value high?" drill-down transparency displaying mathematical formula and underlying balance-sheet features.

### Phase 7: AI Analyst & Provenance RAG
- Conversational corporate intelligence interface with intent classification.
- Hybrid retrieval: SQL structured data + pgvector document chunk embeddings.
- Zero-hallucination policy with mandatory citation links to source filings.

### Phase 8: Fusion Lab (Hypothetical Simulation Engine)
- Combinatorial analysis: User selects Company A + Company B (e.g., Tata Motors + Zomato).
- Synergies evaluated across customer bases, distribution networks, and tech stacks.
- Uncompromising visual labeling: Every generated scenario tagged with `Hypothetical AI Simulation`.

### Phase 9: 3D Universe Spatial View
- Three.js / React Three Fiber interactive 3D galaxy view.
- Celestial clustering of companies by industry sector with orbit-based relationships.

### Phase 10: Enterprise Hardening & Scale
- Scale from 200 to 1,000+ Indian corporate entities.
- Neo4j graph cluster evaluation for large-scale traversals.
- Redis caching for high-frequency graph queries.
