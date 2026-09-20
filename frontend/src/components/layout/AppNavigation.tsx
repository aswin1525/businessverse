import React from 'react';
import { 
  Compass, 
  Building2, 
  Layers, 
  Network, 
  Scale, 
  Atom, 
  Bot, 
  Search, 
  ShieldCheck,
  Activity
} from 'lucide-react';
import { NavSection } from '../../types';
import { Badge } from '../common/Badge';

interface AppNavigationProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  backendOnline?: boolean;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  activeSection,
  onSelectSection,
  searchQuery,
  onSearchChange,
  backendOnline = true,
}) => {
  const navItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
    { id: 'universe', label: 'Universe', icon: <Compass className="w-4 h-4" /> },
    { id: 'companies', label: 'Companies', icon: <Building2 className="w-4 h-4" /> },
    { id: 'industries', label: 'Industries', icon: <Layers className="w-4 h-4" /> },
    { id: 'network', label: 'Business Network', icon: <Network className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare', icon: <Scale className="w-4 h-4" /> },
    { id: 'fusion', label: 'Fusion Lab', icon: <Atom className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Analyst', icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-space-950/90 backdrop-blur-xl border-b border-space-700/80">
      {/* Top telemetry bar */}
      <div className="px-6 py-1.5 bg-space-900/60 border-b border-space-800/60 flex items-center justify-between text-[11px] font-mono text-space-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-brand-emerald">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-semibold tracking-wider">SOURCE PROVENANCE ENFORCED</span>
          </div>
          <span className="text-space-600">|</span>
          <span className="text-space-400">PHASE 1: FOUNDATION RUNTIME</span>
          <span className="text-space-600">|</span>
          <span className="text-space-400">COVERAGE: TOP 100-200 ENTERPRISES (INDIAN ECOSYSTEM)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-space-500">BACKEND API:</span>
            <span className="flex items-center gap-1 text-xs">
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-brand-emerald animate-pulse' : 'bg-brand-amber'}`} />
              <span className={backendOnline ? 'text-brand-emerald font-medium' : 'text-brand-amber'}>
                {backendOnline ? 'READY' : 'STANDALONE'}
              </span>
            </span>
          </div>
          <span className="text-space-600">|</span>
          <span className="text-space-400">CURRENCY: INR (₹ CRORE)</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand identity */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          onClick={() => onSelectSection('universe')}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-space-800 to-space-900 border border-brand-cyan/40 flex items-center justify-center shadow-glow-cyan/20 group-hover:border-brand-cyan transition-colors">
            <Activity className="w-5 h-5 text-brand-cyan group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider text-space-50 font-sans">
                INDIA <span className="text-brand-cyan">BUSINESSVERSE</span>
              </h1>
              <Badge variant="cyan" size="xs">v0.1</Badge>
            </div>
            <p className="text-[11px] text-space-400 tracking-wide font-mono">
              Explore · Connect · Analyze · Simulate
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-space-900/90 border border-space-750 p-1 rounded-lg">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all duration-150 select-none ${
                  isActive
                    ? 'bg-space-800 text-brand-cyan shadow-sm border border-brand-cyan/30'
                    : 'text-space-300 hover:text-space-100 hover:bg-space-850/60 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-brand-cyan' : 'text-space-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Search */}
        <div className="relative w-64 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-space-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search CIN, company, ticker..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-space-900 border border-space-750 rounded-lg text-space-200 placeholder:text-space-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/40 transition-colors font-mono"
          />
        </div>
      </div>
    </header>
  );
};
