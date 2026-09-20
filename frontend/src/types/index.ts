/**
 * Core TypeScript definitions for India BusinessVerse.
 * Reflects the verifiable 12-table relational schema and graph structures.
 */

export type SourceType =
  | 'REGULATORY_FILING'
  | 'ANNUAL_REPORT'
  | 'OFFICIAL_DISCLOSURE'
  | 'MCA_RECORD'
  | 'OPEN_DATA';

export type VerificationStatus = 'VERIFIED' | 'PROVISIONAL' | 'PENDING_REVIEW';

export interface SourceProvenance {
  id: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: SourceType;
  publisher?: string;
  publishedAt?: string;
  collectedAt: string;
  verificationStatus: VerificationStatus;
  checksum?: string;
}

export interface Industry {
  id: string;
  code: string;
  name: string;
  sector: string;
  description?: string;
  parentIndustryId?: string;
}

export type ListedStatus = 'LISTED' | 'UNLISTED';
export type CompanyStatus = 'ACTIVE' | 'AMALGAMATED' | 'STRIKE_OFF' | 'UNDER_LIQUIDATION';

export interface Company {
  id: string;
  cin: string;
  name: string;
  legalName: string;
  nseSymbol?: string;
  bseCode?: string;
  status: CompanyStatus;
  companyClass?: string;
  category?: string;
  registrationDate?: string;
  registeredState?: string;
  headquartersCity: string;
  website?: string;
  listedStatus: ListedStatus;
  parentCompanyId?: string;
  primarySourceId: string;
  primarySource?: SourceProvenance;
  industries?: Industry[];
  foundedYear?: number;
  marketCap?: number; // In INR Crores
  revenue?: number; // In INR Crores
  netProfit?: number; // In INR Crores
}

export type RelationshipType =
  | 'OWNS'
  | 'OWNED_BY'
  | 'SUBSIDIARY_OF'
  | 'PARENT_OF'
  | 'ACQUIRED'
  | 'ACQUIRED_BY'
  | 'MERGED_WITH'
  | 'PARTNERED_WITH'
  | 'INVESTED_IN'
  | 'INVESTED_BY'
  | 'COMPETES_WITH'
  | 'SUPPLIER_OF'
  | 'CUSTOMER_OF'
  | 'JOINT_VENTURE'
  | 'SAME_GROUP'
  | 'OPERATES_IN';

export interface CompanyRelationship {
  id: string;
  sourceCompanyId: string;
  sourceCompanyName?: string;
  targetCompanyId: string;
  targetCompanyName?: string;
  relationshipType: RelationshipType;
  effectiveDate?: string;
  ownershipPercentage?: number;
  description?: string;
  isActive: boolean;
  sourceId: string;
  source?: SourceProvenance;
}

export interface FinancialMetric {
  id: string;
  companyId: string;
  financialYear: string; // e.g. "FY2024"
  reportingPeriod: 'ANNUAL' | 'Q1' | 'Q2' | 'Q3' | 'Q4';
  periodStartDate: string;
  periodEndDate: string;
  currency: 'INR';
  unit: 'CRORE';
  revenue: number | null;
  netProfit: number | null;
  ebitda: number | null;
  totalAssets: number | null;
  totalLiabilities: number | null;
  totalEquity: number | null;
  cashAndEquivalents: number | null;
  totalDebt: number | null;
  eps: number | null;
  dividendPerShare: number | null;
  marketCap: number | null;
  isAudited: boolean;
  sourceId: string;
  source?: SourceProvenance;
  notes?: string;
}

export interface CompanyEvent {
  id: string;
  companyId: string;
  eventType:
    | 'FOUNDED'
    | 'IPO'
    | 'ACQUISITION'
    | 'MERGER'
    | 'PARTNERSHIP'
    | 'INVESTMENT'
    | 'PRODUCT_LAUNCH'
    | 'EXPANSION'
    | 'REBRANDING'
    | 'LEADERSHIP_CHANGE'
    | 'OTHER';
  eventDate: string;
  title: string;
  description?: string;
  targetEntityName?: string;
  sourceId: string;
  source?: SourceProvenance;
}

export type NavSection =
  | 'universe'
  | 'companies'
  | 'industries'
  | 'network'
  | 'compare'
  | 'fusion'
  | 'ai';

export interface NetworkNode {
  id: string;
  name: string;
  nseSymbol?: string;
  sector: string;
  revenueCr?: number;
  marketCapCr?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  val?: number; // Visual weight
  isDemo?: boolean;
}

export interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  type: RelationshipType;
  label?: string;
  strength?: number;
}
