# Data Ingestion & Provenance Storage

This directory manages raw filings, normalized datasets, and the source provenance registry.

## Directory Structure

- `raw/`: Unmodified regulatory filing artifacts (MCA extracts, NSE XBRL XML/JSON, SEBI PDFs).
- `processed/`: Validated and normalized JSON / Parquet datasets ready for database import.
- `imports/`: ETL scripts and database seeders.
- `provenance/`: Checksums and audit trail of ingested documents.

## Strict Rules
- NEVER fabricate fake company or financial data.
- Every record must be linked to a verifiable record in the `sources` table.
