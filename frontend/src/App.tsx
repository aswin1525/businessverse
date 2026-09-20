import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Atom, 
  Bot, 
  ShieldCheck, 
  Database, 
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { NavSection } from './types';
import { AppNavigation } from './components/layout/AppNavigation';
import { UniverseCanvas } from './components/universe/UniverseCanvas';
import { Panel } from './components/common/Panel';
import { Button } from './components/common/Button';
import { Badge } from './components/common/Badge';
import { Metric } from './components/common/Metric';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NavSection>('universe');
  const [searchQuery, setSearchQuery] = useState('');
  const [backendStatus, setBackendStatus] = useState<boolean | null>(null);
  const [backendMeta, setBackendMeta] = useState<any>(null);

  // Probe Spring Boot backend health endpoint
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('/api/v1/health');
        if (res.ok) {
          const json = await res.json();
          setBackendStatus(json.success);
          setBackendMeta(json.data);
        } else {
          setBackendStatus(false);
        }
      } catch (err) {
        // Fallback to standalone mode if backend is not started
        setBackendStatus(false);
      }
    };

    checkBackend();
    const timer = setInterval(checkBackend, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-space-950 text-space-100 flex flex-col font-sans">
      {/* Primary Top Navigation */}
      <AppNavigation
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        backendOnline={backendStatus === true}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeSection === 'universe' && (
          <div className="flex-1 flex flex-col">
            <UniverseCanvas searchFilter={searchQuery} />

            {/* Quick Intelligence Banner below canvas */}
            <div className="bg-space-900 border-t border-space-800 px-8 py-6">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-space-200 uppercase tracking-wider">
                      Authoritative Sources
                    </h4>
                    <p className="text-xs text-space-400 mt-1">
                      Direct ingestion from MCA V3 master data and NSE XBRL financial filings. Zero synthetic hallucinations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-space-200 uppercase tracking-wider">
                      Source Provenance
                    </h4>
                    <p className="text-xs text-space-400 mt-1">
                      Every financial metric, equity ownership link, and corporate event carries cryptographic source traceability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-violet/10 border border-brand-violet/30 text-brand-violet">
                    <Atom className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-space-200 uppercase tracking-wider">
                      Fusion Lab Engine
                    </h4>
                    <p className="text-xs text-space-400 mt-1">
                      Simulate multi-enterprise combinatorial synergies, customer overlaps, and joint-venture strategies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-amber/10 border border-brand-amber/30 text-brand-amber">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-space-200 uppercase tracking-wider">
                      Grounded AI Analyst
                    </h4>
                    <p className="text-xs text-space-400 mt-1">
                      Conversational intelligence strictly citing verified statutory regulatory filings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section: Companies Cockpit */}
        {activeSection === 'companies' && (
          <div className="max-w-7xl mx-auto px-8 py-8 w-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-space-50">Enterprise Directory</h2>
                <p className="text-xs text-space-400 font-mono mt-1">
                  Master index of Indian registered and publicly listed entities
                </p>
              </div>
              <Badge variant="cyan" size="md">100–200 Initial Scope</Badge>
            </div>

            <Panel title="Architecture Schema Target" subtitle="Phase 2 Ingestion Registry">
              <div className="p-6 bg-space-900 rounded-lg border border-space-750 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-brand-emerald text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Relational Schema Active: `companies`, `company_industries`, `financials`, `documents`</span>
                </div>
                <p className="text-xs text-space-300 leading-relaxed">
                  Companies are registered with their official Ministry of Corporate Affairs 21-character CIN, legal name, registered state, capital structure, and primary source provenance pointer.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <Metric label="Target Enterprise Universe" value="200" unit="Companies" />
                  <Metric label="Primary Verification Standard" value="MCA + NSE" unit="Regulated" />
                  <Metric label="Schema Integrity" value="100%" unit="Enforced FK" />
                </div>
              </div>
            </Panel>
          </div>
        )}

        {/* Section: Industries */}
        {activeSection === 'industries' && (
          <div className="max-w-7xl mx-auto px-8 py-8 w-full flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold text-space-50">Industrial Taxonomy & Sectors</h2>
              <p className="text-xs text-space-400 font-mono mt-1">
                Hierarchical sector breakdown across the Indian industrial landscape
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Information Technology', count: '45+ Cos', color: 'blue', desc: 'Enterprise SaaS, Digital Transformation, IT Services' },
                { name: 'Automotive & Mobility', count: '30+ Cos', color: 'cyan', desc: 'EV OEMs, Commercial Vehicles, Tier-1 Component Makers' },
                { name: 'Banking & Financials', count: '40+ Cos', color: 'emerald', desc: 'Scheduled Commercial Banks, NBFCs, FinTech' },
                { name: 'Energy & Utilities', count: '25+ Cos', color: 'amber', desc: 'Green Hydrogen, Solar EPC, Power Grid, Refining' },
                { name: 'FMCG & Consumer Goods', count: '35+ Cos', color: 'rose', desc: 'Retail, Personal Care, Food Processing & Packaged Goods' },
                { name: 'Telecom & Digital Platforms', count: '20+ Cos', color: 'violet', desc: '5G Infrastructure, Fiber, Digital Ecosystems' },
              ].map((sector, idx) => (
                <Panel key={idx} title={sector.name} badge={<Badge variant={sector.color as any} size="xs">{sector.count}</Badge>}>
                  <p className="text-xs text-space-400">{sector.desc}</p>
                  <div className="mt-4 pt-3 border-t border-space-800 flex justify-between items-center text-xs">
                    <span className="text-space-500 font-mono">Taxonomy: NIC 2008</span>
                    <Button variant="ghost" size="xs" rightIcon={<ArrowRight className="w-3 h-3" />}>
                      Explore Nodes
                    </Button>
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        )}

        {/* Section: Business Network */}
        {activeSection === 'network' && (
          <div className="max-w-7xl mx-auto px-8 py-8 w-full flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold text-space-50">Business Network Graph</h2>
              <p className="text-xs text-space-400 font-mono mt-1">
                Deep relational graph explorer with path tracing and ecosystem isolation
              </p>
            </div>

            <Panel title="Interactive Graph Topology" glow="cyan">
              <div className="p-8 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                  <Network className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-space-100">Knowledge Graph Visualization Active</h3>
                <p className="text-xs text-space-400 max-w-xl">
                  The relationship graph links enterprises through verified connections: `OWNS`, `SUBSIDIARY_OF`, `PARTNERED_WITH`, `ACQUIRED`, and `COMPETES_WITH`.
                </p>
                <Button 
                  variant="primary" 
                  size="md" 
                  onClick={() => setActiveSection('universe')}
                  leftIcon={<Share2 className="w-4 h-4" />}
                >
                  Launch Spatial Universe Canvas
                </Button>
              </div>
            </Panel>
          </div>
        )}

        {/* Section: Compare */}
        {activeSection === 'compare' && (
          <div className="max-w-7xl mx-auto px-8 py-8 w-full flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold text-space-50">Company Comparison Cockpit</h2>
              <p className="text-xs text-space-400 font-mono mt-1">
                Multi-entity factual benchmark without synthetic scoring or bias
              </p>
            </div>

            <Panel title="Benchmark Dimensions">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-space-300">
                <div className="p-4 bg-space-900 border border-space-750 rounded-lg">
                  <span className="font-semibold text-space-100 block mb-1">Financial History</span>
                  5Y/10Y Audited Revenue, PAT margins, EBITDA and Debt-to-Equity ratios.
                </div>
                <div className="p-4 bg-space-900 border border-space-750 rounded-lg">
                  <span className="font-semibold text-space-100 block mb-1">Segmental Exposure</span>
                  Revenue contribution per operational division and product line.
                </div>
                <div className="p-4 bg-space-900 border border-space-750 rounded-lg">
                  <span className="font-semibold text-space-100 block mb-1">Geographic Footprint</span>
                  Manufacturing plants, R&D campuses, and registered offices across states.
                </div>
                <div className="p-4 bg-space-900 border border-space-750 rounded-lg">
                  <span className="font-semibold text-space-100 block mb-1">Ecosystem DNA</span>
                  Calculated explainable vector representing digital vs physical intensity.
                </div>
              </div>
            </Panel>
          </div>
        )}

        {/* Section: Fusion Lab */}
        {activeSection === 'fusion' && (
          <div className="max-w-7xl mx-auto px-8 py-8 w-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-space-50">Fusion Lab</h2>
                <p className="text-xs text-space-400 font-mono mt-1">
                  Combinatorial corporate synergy and hypothetical joint-venture simulator
                </p>
              </div>
              <Badge variant="violet" size="md">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Hypothetical AI Simulation
              </Badge>
            </div>

            <div className="p-4 bg-brand-violet/10 border border-brand-violet/30 rounded-xl text-xs text-brand-violet/90 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-brand-violet" />
              <span>
                <strong>CRITICAL MANDATE:</strong> All scenarios produced within the Fusion Lab are labeled as <em>Hypothetical AI-Generated Simulations</em>. They are never presented as factual corporate plans.
              </span>
            </div>

            <Panel title="Synergy Modeling Pipeline" glow="violet">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-space-900 border border-space-750 rounded-lg flex flex-col gap-2">
                  <Badge variant="cyan" size="xs">Step 1</Badge>
                  <h4 className="text-sm font-semibold text-space-100">Select Combinatorial Entities</h4>
                  <p className="text-xs text-space-400">
                    Pair two or more companies across divergent sectors (e.g. Tata Motors + Zomato, or Reliance + HDFC).
                  </p>
                </div>
                <div className="p-4 bg-space-900 border border-space-750 rounded-lg flex flex-col gap-2">
                  <Badge variant="violet" size="xs">Step 2</Badge>
                  <h4 className="text-sm font-semibold text-space-100">Cross-Vector Analysis</h4>
                  <p className="text-xs text-space-400">
                    Algorithmically evaluate distribution overlap, customer demographic intersection, and technology compatibility.
                  </p>
                </div>
                <div className="p-4 bg-space-900 border border-space-750 rounded-lg flex flex-col gap-2">
                  <Badge variant="emerald" size="xs">Step 3</Badge>
                  <h4 className="text-sm font-semibold text-space-100">Simulate JV Outcome</h4>
                  <p className="text-xs text-space-400">
                    Generate multi-scenario models with clear risk projections and capability heatmaps.
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        )}

        {/* Section: AI Analyst */}
        {activeSection === 'ai' && (
          <div className="max-w-7xl mx-auto px-8 py-8 w-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-space-50">AI Corporate Intelligence Analyst</h2>
                <p className="text-xs text-space-400 font-mono mt-1">
                  Source-grounded RAG query engine citing exact regulatory filings
                </p>
              </div>
              <Badge variant="emerald" size="md">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Citations Enforced
              </Badge>
            </div>

            <Panel title="Natural Language Grounding Interface" glow="violet">
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-space-900 border border-space-750 rounded-lg text-xs text-space-300">
                  <span className="font-semibold text-brand-cyan block mb-1">RAG Architecture Standard:</span>
                  User Query → Intent Parsing → Structured PostgreSQL DB Retrieval + pgvector Regulatory Document Search → Synthesized Intelligence with Footnote Citations.
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-space-400 uppercase tracking-wider">
                    Example Authoritative Queries
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      'Compare Tata Motors and Mahindra & Mahindra FY24 automotive revenue and operating margins.',
                      'Which entities belong to the Reliance Industries telecom and digital ecosystem?',
                      'List all strategic acquisitions made by TCS in cloud engineering over the last 5 years.',
                      'What is the current ownership percentage of Tata Sons in Tata Motors?'
                    ].map((q, idx) => (
                      <div key={idx} className="p-3 bg-space-850 border border-space-800 rounded-md text-xs text-space-300 hover:border-brand-cyan/40 hover:text-white transition-colors cursor-pointer flex items-center justify-between">
                        <span>"{q}"</span>
                        <ArrowRight className="w-3.5 h-3.5 text-space-500 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        )}
      </main>

      {/* Global Footer with System Telemetry */}
      <footer className="w-full bg-space-950 border-t border-space-800/80 px-8 py-5 text-xs text-space-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-space-300">INDIA BUSINESSVERSE</span>
            <span>—</span>
            <span>Explore. Connect. Analyze. Simulate.</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>POSTGRESQL + FLYWAY DDL READY</span>
            <span className="text-space-700">|</span>
            <span>SPRING BOOT 3 REST API {backendMeta?.activeProfile ? `(${backendMeta.activeProfile.toUpperCase()})` : ''}</span>
            <span className="text-space-700">|</span>
            <span>DATA PROVENANCE: 100% REGULATED</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
