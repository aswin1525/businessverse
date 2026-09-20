# India BusinessVerse

> **Explore. Connect. Analyze. Simulate.**

India BusinessVerse is an AI-powered business intelligence and knowledge-graph platform focused on Indian enterprise ecosystems. It models real Indian companies, their financial metrics, corporate history, business segments, subsidiaries, cross-holdings, acquisitions, and strategic partnerships as an interactive, multidimensional network.

---

## 🏛️ Core Principles

1. **Source Provenance First**: Every company, financial metric, event, and relationship is linked to an authoritative verifiable source (MCA, NSE XBRL filings, SEBI disclosures, audited annual reports). No hallucinated or fake corporate data is tolerated.
2. **Knowledge Graph Navigation**: Companies are nodes; equity holdings, subsidiaries, joint ventures, partnerships, and supplier chains are edges.
3. **Bloomberg Meets Spatial Aesthetics**: A dark, data-dense, futuristic interface engineered for deep corporate intelligence and interactive exploration.
4. **AI Separation**: Strictly bifurcates source-grounded corporate facts from hypothetical AI simulations (Fusion Lab) and generative summaries.

---

## 🧱 Project Architecture

```
india-businessverse/
├── frontend/         # React 18, TypeScript, Vite, Tailwind CSS, D3.js, Lucide
├── backend/          # Java 17, Spring Boot 3, Spring Data JPA, PostgreSQL, Flyway
├── ml-service/       # Python 3.13, Embeddings, Clustering, Business DNA, RAG
├── data/             # Ingestion pipelines, normalization schemas, provenance logs
└── docs/             # Technical architecture, data model, and roadmap specifications
```

---

## 🚀 Quick Start (Phase 1 Foundation)

### Prerequisites
- Node.js >= 18 (Node 22 recommended)
- Java OpenJDK 17
- Maven 3.8+
- Python 3.10+ (Python 3.13 supported)

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:5173`.

### 2. Backend Setup
```bash
cd backend
mvn clean spring-boot:run
```
By default, the backend runs on `http://localhost:8080` with the `dev` profile (in-memory H2 with PostgreSQL-compatible schema and mock health readiness).
To run against PostgreSQL, configure `.env` or set `SPRING_PROFILES_ACTIVE=prod`.

Health endpoints:
- `http://localhost:8080/api/v1/health`
- `http://localhost:8080/api/v1/health/system-info`

---

## 📖 Documentation

- [System Architecture](docs/architecture.md)
- [Data Model & ER Design](docs/data-model.md)
- [Data Sources & Ingestion](docs/data-sources.md)
- [Development Roadmap](docs/development-roadmap.md)
