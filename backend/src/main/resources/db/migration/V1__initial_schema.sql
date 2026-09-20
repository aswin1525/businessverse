-- =============================================================================
-- INDIA BUSINESSVERSE: V1 INITIAL SCHEMA
-- Core Tables: sources, companies, industries, company_industries, financials,
--              company_events, relationships, products, services,
--              business_segments, locations, documents
-- =============================================================================

-- 1. Sources (The Provenance Anchor)
CREATE TABLE IF NOT EXISTS sources (
    id VARCHAR(36) PRIMARY KEY,
    source_name VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    publisher VARCHAR(150),
    published_at DATE,
    collected_at TIMESTAMP NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED',
    checksum VARCHAR(128),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sources_type ON sources(source_type);
CREATE INDEX idx_sources_status ON sources(verification_status);

-- 2. Companies
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(36) PRIMARY KEY,
    cin VARCHAR(21) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    nse_symbol VARCHAR(20) UNIQUE,
    bse_code VARCHAR(20) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    company_class VARCHAR(50),
    category VARCHAR(100),
    registration_date DATE,
    registered_state VARCHAR(100),
    headquarters_city VARCHAR(100),
    website VARCHAR(255),
    listed_status VARCHAR(50) NOT NULL DEFAULT 'LISTED',
    parent_company_id VARCHAR(36),
    primary_source_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_companies_parent FOREIGN KEY (parent_company_id) REFERENCES companies(id),
    CONSTRAINT fk_companies_source FOREIGN KEY (primary_source_id) REFERENCES sources(id)
);

CREATE INDEX idx_companies_cin ON companies(cin);
CREATE INDEX idx_companies_nse ON companies(nse_symbol);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_status ON companies(status);

-- 3. Industries
CREATE TABLE IF NOT EXISTS industries (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    description TEXT,
    parent_industry_id VARCHAR(36),
    CONSTRAINT fk_industries_parent FOREIGN KEY (parent_industry_id) REFERENCES industries(id)
);

CREATE INDEX idx_industries_sector ON industries(sector);

-- 4. Company Industries (Mapping)
CREATE TABLE IF NOT EXISTS company_industries (
    company_id VARCHAR(36) NOT NULL,
    industry_id VARCHAR(36) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    source_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (company_id, industry_id),
    CONSTRAINT fk_ci_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_ci_industry FOREIGN KEY (industry_id) REFERENCES industries(id),
    CONSTRAINT fk_ci_source FOREIGN KEY (source_id) REFERENCES sources(id)
);

-- 5. Financials
CREATE TABLE IF NOT EXISTS financials (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    financial_year VARCHAR(10) NOT NULL,
    reporting_period VARCHAR(20) NOT NULL DEFAULT 'ANNUAL',
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    unit VARCHAR(20) NOT NULL DEFAULT 'CRORE',
    revenue NUMERIC(18,2),
    net_profit NUMERIC(18,2),
    ebitda NUMERIC(18,2),
    total_assets NUMERIC(18,2),
    total_liabilities NUMERIC(18,2),
    total_equity NUMERIC(18,2),
    cash_and_equivalents NUMERIC(18,2),
    total_debt NUMERIC(18,2),
    eps NUMERIC(10,2),
    dividend_per_share NUMERIC(10,2),
    market_cap NUMERIC(18,2),
    is_audited BOOLEAN NOT NULL DEFAULT TRUE,
    source_id VARCHAR(36) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_financials_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_financials_source FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE INDEX idx_financials_company ON financials(company_id);
CREATE INDEX idx_financials_fy ON financials(financial_year);

-- 6. Company Events
CREATE TABLE IF NOT EXISTS company_events (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_entity_name VARCHAR(255),
    source_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_events_source FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE INDEX idx_events_company ON company_events(company_id);
CREATE INDEX idx_events_date ON company_events(event_date);
CREATE INDEX idx_events_type ON company_events(event_type);

-- 7. Relationships (Knowledge Graph Edges)
CREATE TABLE IF NOT EXISTS relationships (
    id VARCHAR(36) PRIMARY KEY,
    source_company_id VARCHAR(36) NOT NULL,
    target_company_id VARCHAR(36) NOT NULL,
    relationship_type VARCHAR(50) NOT NULL,
    effective_date DATE,
    end_date DATE,
    ownership_percentage NUMERIC(5,2),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    source_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rel_source FOREIGN KEY (source_company_id) REFERENCES companies(id),
    CONSTRAINT fk_rel_target FOREIGN KEY (target_company_id) REFERENCES companies(id),
    CONSTRAINT fk_rel_provenance FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE INDEX idx_rel_source ON relationships(source_company_id);
CREATE INDEX idx_rel_target ON relationships(target_company_id);
CREATE INDEX idx_rel_type ON relationships(relationship_type);

-- 8. Products
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    launch_year INT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    source_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_products_source FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE INDEX idx_products_company ON products(company_id);

-- 9. Services
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    source_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_services_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_services_source FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE INDEX idx_services_company ON services(company_id);

-- 10. Business Segments
CREATE TABLE IF NOT EXISTS business_segments (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    segment_name VARCHAR(255) NOT NULL,
    description TEXT,
    revenue NUMERIC(18,2),
    revenue_percentage NUMERIC(5,2),
    financial_year VARCHAR(10) NOT NULL,
    source_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_segments_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_segments_source FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE INDEX idx_segments_company ON business_segments(company_id);

-- 11. Locations
CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    location_type VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6),
    address TEXT,
    source_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_locations_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_locations_source FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE INDEX idx_locations_company ON locations(company_id);

-- 12. Documents (for future RAG & Audit archive)
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    financial_year VARCHAR(10),
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    extracted_text TEXT,
    metadata_json TEXT,
    source_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_documents_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_documents_source FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE INDEX idx_documents_company ON documents(company_id);
CREATE INDEX idx_documents_type ON documents(document_type);
