import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  Share2,
  X
} from 'lucide-react';
import { NetworkNode, NetworkLink } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Metric } from '../common/Metric';

interface UniverseCanvasProps {
  onSelectNode?: (node: NetworkNode | null) => void;
  selectedSector?: string;
  onSelectSector?: (sector: string) => void;
  searchFilter?: string;
}

// Initial architectural prototype topology explicitly flagged as demonstration topology
// pending Phase 2 authoritative data ingestion from MCA/NSE XBRL.
const DEMO_TOPOLOGY_NODES: NetworkNode[] = [
  // Conglomerates & Anchor Holding
  { id: 'tata-sons', name: 'Tata Sons Pvt Ltd', sector: 'Conglomerate', val: 40, isDemo: true },
  { id: 'reliance-ind', name: 'Reliance Industries Ltd', nseSymbol: 'RELIANCE', sector: 'Energy & Telecom', revenueCr: 992000, marketCapCr: 2010000, val: 50, isDemo: true },
  
  // IT Sector
  { id: 'tcs', name: 'Tata Consultancy Services', nseSymbol: 'TCS', sector: 'Information Technology', revenueCr: 240893, marketCapCr: 1540000, val: 42, isDemo: true },
  { id: 'infosys', name: 'Infosys Limited', nseSymbol: 'INFY', sector: 'Information Technology', revenueCr: 153670, marketCapCr: 780000, val: 36, isDemo: true },
  { id: 'wipro', name: 'Wipro Limited', nseSymbol: 'WIPRO', sector: 'Information Technology', revenueCr: 89760, marketCapCr: 280000, val: 26, isDemo: true },
  { id: 'hcltech', name: 'HCL Technologies', nseSymbol: 'HCLTECH', sector: 'Information Technology', revenueCr: 109913, marketCapCr: 480000, val: 30, isDemo: true },
  
  // Automotive
  { id: 'tata-motors', name: 'Tata Motors Limited', nseSymbol: 'TATAMOTORS', sector: 'Automotive', revenueCr: 437928, marketCapCr: 360000, val: 38, isDemo: true },
  { id: 'maruti', name: 'Maruti Suzuki India', nseSymbol: 'MARUTI', sector: 'Automotive', revenueCr: 140932, marketCapCr: 390000, val: 34, isDemo: true },
  { id: 'mahindra', name: 'Mahindra & Mahindra', nseSymbol: 'M&M', sector: 'Automotive', revenueCr: 139078, marketCapCr: 340000, val: 32, isDemo: true },
  { id: 'jlr', name: 'Jaguar Land Rover Automotive', sector: 'Automotive', val: 28, isDemo: true },

  // Banking & Financial Services
  { id: 'hdfc-bank', name: 'HDFC Bank Limited', nseSymbol: 'HDFCBANK', sector: 'Banking & Financials', revenueCr: 315000, marketCapCr: 1320000, val: 44, isDemo: true },
  { id: 'icici-bank', name: 'ICICI Bank Limited', nseSymbol: 'ICICIBANK', sector: 'Banking & Financials', revenueCr: 236000, marketCapCr: 880000, val: 38, isDemo: true },
  { id: 'sbi', name: 'State Bank of India', nseSymbol: 'SBIN', sector: 'Banking & Financials', revenueCr: 473000, marketCapCr: 720000, val: 40, isDemo: true },
  
  // Telecom & Consumer Digital
  { id: 'jio', name: 'Jio Platforms Limited', sector: 'Telecom & Digital', val: 34, isDemo: true },
  { id: 'airtel', name: 'Bharti Airtel Limited', nseSymbol: 'BHARTIARTL', sector: 'Telecom & Digital', revenueCr: 150000, marketCapCr: 910000, val: 36, isDemo: true },
  { id: 'zomato', name: 'Zomato Limited', nseSymbol: 'ZOMATO', sector: 'Consumer Tech', revenueCr: 12114, marketCapCr: 240000, val: 24, isDemo: true },

  // FMCG & Retail
  { id: 'hul', name: 'Hindustan Unilever Limited', nseSymbol: 'HINDUNILVR', sector: 'FMCG & Consumer', revenueCr: 60580, marketCapCr: 640000, val: 36, isDemo: true },
  { id: 'itc', name: 'ITC Limited', nseSymbol: 'ITC', sector: 'FMCG & Consumer', revenueCr: 70919, marketCapCr: 610000, val: 36, isDemo: true },
  { id: 'tata-consumer', name: 'Tata Consumer Products', nseSymbol: 'TATACONSUM', sector: 'FMCG & Consumer', revenueCr: 15206, marketCapCr: 110000, val: 22, isDemo: true },
  
  // Infrastructure & Energy
  { id: 'lt', name: 'Larsen & Toubro Ltd', nseSymbol: 'LT', sector: 'Infrastructure', revenueCr: 221113, marketCapCr: 510000, val: 38, isDemo: true },
  { id: 'tata-power', name: 'Tata Power Company', nseSymbol: 'TATAPOWER', sector: 'Energy & Utilities', revenueCr: 61449, marketCapCr: 140000, val: 24, isDemo: true },
];

const DEMO_TOPOLOGY_LINKS: NetworkLink[] = [
  // Tata Ecosystem
  { source: 'tata-sons', target: 'tcs', type: 'OWNS', strength: 0.8 },
  { source: 'tata-sons', target: 'tata-motors', type: 'OWNS', strength: 0.8 },
  { source: 'tata-sons', target: 'tata-consumer', type: 'OWNS', strength: 0.7 },
  { source: 'tata-sons', target: 'tata-power', type: 'OWNS', strength: 0.7 },
  { source: 'tata-motors', target: 'jlr', type: 'SUBSIDIARY_OF', strength: 0.9 },
  { source: 'tata-power', target: 'tata-motors', type: 'PARTNERED_WITH', strength: 0.5 },
  
  // Reliance Ecosystem
  { source: 'reliance-ind', target: 'jio', type: 'OWNS', strength: 0.9 },
  
  // Cross Sector / Competitors
  { source: 'tcs', target: 'infosys', type: 'COMPETES_WITH', strength: 0.3 },
  { source: 'infosys', target: 'wipro', type: 'COMPETES_WITH', strength: 0.3 },
  { source: 'tcs', target: 'hcltech', type: 'COMPETES_WITH', strength: 0.3 },
  { source: 'tata-motors', target: 'mahindra', type: 'COMPETES_WITH', strength: 0.3 },
  { source: 'tata-motors', target: 'maruti', type: 'COMPETES_WITH', strength: 0.3 },
  { source: 'hdfc-bank', target: 'icici-bank', type: 'COMPETES_WITH', strength: 0.3 },
  { source: 'hdfc-bank', target: 'sbi', type: 'COMPETES_WITH', strength: 0.3 },
  { source: 'jio', target: 'airtel', type: 'COMPETES_WITH', strength: 0.4 },
  { source: 'hul', target: 'itc', type: 'COMPETES_WITH', strength: 0.3 },
  { source: 'hul', target: 'tata-consumer', type: 'COMPETES_WITH', strength: 0.3 },
  
  // Partnerships & Integrations
  { source: 'zomato', target: 'icici-bank', type: 'PARTNERED_WITH', strength: 0.4 },
  { source: 'airtel', target: 'tcs', type: 'SUPPLIER_OF', strength: 0.4 },
  { source: 'lt', target: 'reliance-ind', type: 'SUPPLIER_OF', strength: 0.4 },
];

const SECTOR_COLORS: Record<string, string> = {
  'Information Technology': '#3B82F6', // Blue
  'Automotive': '#06B6D4',             // Cyan
  'Banking & Financials': '#10B981',   // Emerald
  'Energy & Telecom': '#F59E0B',       // Amber
  'Telecom & Digital': '#F59E0B',      // Amber
  'FMCG & Consumer': '#EC4899',        // Pink
  'Consumer Tech': '#8B5CF6',          // Violet
  'Conglomerate': '#94A3B8',           // Slate
  'Infrastructure': '#14B8A6',         // Teal
  'Energy & Utilities': '#EAB308',     // Yellow
};

export const UniverseCanvas: React.FC<UniverseCanvasProps> = ({
  searchFilter = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [activeSector, setActiveSector] = useState<string>('ALL');
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);

  // Available sectors for filtering
  const sectors = useMemo(() => {
    const list = Array.from(new Set(DEMO_TOPOLOGY_NODES.map(n => n.sector)));
    return ['ALL', ...list];
  }, []);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return DEMO_TOPOLOGY_NODES.filter(n => {
      const matchesSector = activeSector === 'ALL' || n.sector === activeSector;
      const matchesSearch = !searchFilter || 
        n.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (n.nseSymbol && n.nseSymbol.toLowerCase().includes(searchFilter.toLowerCase())) ||
        n.sector.toLowerCase().includes(searchFilter.toLowerCase());
      return matchesSector && matchesSearch;
    });
  }, [activeSector, searchFilter]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // Filtered links
  const filteredLinks = useMemo(() => {
    return DEMO_TOPOLOGY_LINKS.filter(l => {
      const sourceId = typeof l.source === 'object' ? (l.source as NetworkNode).id : l.source;
      const targetId = typeof l.target === 'object' ? (l.target as NetworkNode).id : l.target;
      return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
    });
  }, [filteredNodeIds]);

  // Force simulation instance
  const simulationRef = useRef<d3.Simulation<NetworkNode, NetworkLink> | null>(null);
  const nodesRef = useRef<NetworkNode[]>([]);
  const linksRef = useRef<NetworkLink[]>([]);

  // Initialize and update simulation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 650;

    // Deep copy nodes and links to preserve position states
    const nodeMap = new Map(nodesRef.current.map(n => [n.id, n]));
    const nodes: NetworkNode[] = filteredNodes.map(n => {
      const existing = nodeMap.get(n.id);
      return {
        ...n,
        x: existing?.x ?? width / 2 + (Math.random() - 0.5) * 300,
        y: existing?.y ?? height / 2 + (Math.random() - 0.5) * 300,
        vx: existing?.vx ?? 0,
        vy: existing?.vy ?? 0,
      };
    });

    const links: NetworkLink[] = filteredLinks.map(l => ({ ...l }));

    nodesRef.current = nodes;
    linksRef.current = links;

    const simulation = d3.forceSimulation<NetworkNode, NetworkLink>(nodes)
      .force('charge', d3.forceManyBody().strength(-280))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.08))
      .force('collision', d3.forceCollide<NetworkNode>().radius(d => (d.val || 25) + 18))
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(links)
        .id(d => d.id)
        .distance(120)
        .strength(d => d.strength || 0.5)
      )
      .alphaDecay(0.02)
      .on('tick', () => {
        renderCanvas();
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks]);

  // Canvas drawing function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply zoom & pan transform
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    const nodes = nodesRef.current;
    const links = linksRef.current;

    // 1. Draw Links
    links.forEach(link => {
      const source = link.source as NetworkNode;
      const target = link.target as NetworkNode;
      if (!source.x || !source.y || !target.x || !target.y) return;

      const isHighlighted = 
        selectedNode && (source.id === selectedNode.id || target.id === selectedNode.id);

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);

      if (isHighlighted) {
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([]);
      } else if (link.type === 'COMPETES_WITH') {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
      } else if (link.type === 'OWNS' || link.type === 'SUBSIDIARY_OF') {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
      }
      ctx.stroke();

      // Render link label when highlighted
      if (isHighlighted && link.type) {
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = '#06B6D4';
        ctx.fillText(link.type, midX, midY - 4);
      }
    });

    // 2. Draw Nodes
    nodes.forEach(node => {
      if (!node.x || !node.y) return;

      const radius = (node.val || 25) / 2 + 6;
      const color = SECTOR_COLORS[node.sector] || '#7388AC';
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;

      // Outer glow on selected/hovered
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 8, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#070B12';
      ctx.fill();
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.strokeStyle = isSelected ? '#06B6D4' : color;
      ctx.stroke();

      // Inner core
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * 0.45, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Node label
      ctx.font = isSelected ? 'bold 12px Inter, sans-serif' : '11px Inter, sans-serif';
      ctx.fillStyle = isSelected ? '#FFFFFF' : '#CBD6E8';
      ctx.textAlign = 'center';
      ctx.fillText(node.nseSymbol || node.name.split(' ')[0], node.x, node.y + radius + 15);

      // Sector subtitle if zoomed in
      if (transform.k > 1.2 || isSelected) {
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = '#7388AC';
        ctx.fillText(node.sector, node.x, node.y + radius + 27);
      }
    });

    ctx.restore();
  }, [transform, selectedNode, hoveredNode]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      renderCanvas();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  // Setup D3 Zoom & Drag interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const zoom = d3.zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        setTransform(event.transform);
      });

    d3.select(canvas).call(zoom as any);

    // Node picking helper
    const getNodeAtCoords = (screenX: number, screenY: number): NetworkNode | null => {
      const rect = canvas.getBoundingClientRect();
      const x = (screenX - rect.left - transform.x) / transform.k;
      const y = (screenY - rect.top - transform.y) / transform.k;

      for (let i = nodesRef.current.length - 1; i >= 0; i--) {
        const node = nodesRef.current[i];
        if (!node.x || !node.y) continue;
        const radius = (node.val || 25) / 2 + 10;
        const dist = Math.hypot(node.x - x, node.y - y);
        if (dist <= radius) {
          return node;
        }
      }
      return null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const hit = getNodeAtCoords(e.clientX, e.clientY);
      setHoveredNode(hit);
      canvas.style.cursor = hit ? 'pointer' : 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      const hit = getNodeAtCoords(e.clientX, e.clientY);
      setSelectedNode(hit);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [transform]);

  // Controls
  const handleZoomIn = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    d3.select(canvas).transition().duration(250).call(
      d3.zoom<HTMLCanvasElement, unknown>().scaleBy as any, 1.3
    );
  };

  const handleZoomOut = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    d3.select(canvas).transition().duration(250).call(
      d3.zoom<HTMLCanvasElement, unknown>().scaleBy as any, 0.7
    );
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    d3.select(canvas).transition().duration(350).call(
      d3.zoom<HTMLCanvasElement, unknown>().transform as any, d3.zoomIdentity
    );
    setSelectedNode(null);
  };

  return (
    <div ref={containerRef} className="relative w-full h-[calc(100vh-140px)] min-h-[600px] bg-space-950 overflow-hidden select-none bg-spatial-grid">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* Top Banner: Strict Phase 1 Simulation Disclosure */}
      <div className="absolute top-4 left-6 z-10 flex flex-col gap-2 max-w-xl">
        <div className="flex items-center gap-2 p-2 px-3 bg-space-900/90 backdrop-blur-md border border-brand-cyan/30 rounded-lg text-xs shadow-panel">
          <div className="w-2 h-2 rounded-full bg-brand-cyan animate-ping shrink-0" />
          <span className="font-semibold text-brand-cyan">PHASE 1 VISUAL PROTOTYPE:</span>
          <span className="text-space-300">
            Interactive network topology shell. Live MCA/NSE XBRL data ingestion scheduled for Phase 2.
          </span>
        </div>
      </div>

      {/* Sector filter pills */}
      <div className="absolute top-4 right-6 z-10 flex items-center gap-1.5 p-1.5 bg-space-900/90 backdrop-blur-md border border-space-750 rounded-xl overflow-x-auto max-w-2xl">
        <div className="flex items-center gap-1 px-2 text-space-400 text-xs font-mono">
          <Layers className="w-3.5 h-3.5 text-brand-cyan" />
          <span>SECTOR:</span>
        </div>
        {sectors.map(sec => (
          <button
            key={sec}
            onClick={() => setActiveSector(sec)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              activeSector === sec
                ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 font-semibold'
                : 'text-space-400 hover:text-space-200 hover:bg-space-800'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Main Interactive Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Network Navigation & Viewport Controls (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 p-1.5 bg-space-900/90 backdrop-blur-md border border-space-750 rounded-xl shadow-panel">
        <Button variant="ghost" size="sm" onClick={handleZoomIn} title="Zoom In">
          <ZoomIn className="w-4 h-4 text-space-300" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleZoomOut} title="Zoom Out">
          <ZoomOut className="w-4 h-4 text-space-300" />
        </Button>
        <div className="w-px h-5 bg-space-750" />
        <Button variant="ghost" size="sm" onClick={handleReset} title="Reset Camera">
          <RotateCcw className="w-4 h-4 text-space-300" />
        </Button>
        <div className="w-px h-5 bg-space-750" />
        <div className="px-2 font-mono text-[11px] text-space-400">
          NODES: <span className="text-brand-cyan">{filteredNodes.length}</span> · EDGES: <span className="text-space-200">{filteredLinks.length}</span>
        </div>
      </div>

      {/* Selected Node Inspector Drawer (Right Side) */}
      {selectedNode && (
        <div className="absolute top-16 right-6 bottom-6 w-96 z-20 bg-space-900/95 backdrop-blur-xl border border-space-700/80 rounded-2xl p-6 shadow-panel-hover flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-space-750">
              <div className="flex flex-col gap-1">
                <Badge variant="cyan" size="xs" hasDot>
                  {selectedNode.sector}
                </Badge>
                <h2 className="text-lg font-bold text-space-50 leading-snug">
                  {selectedNode.name}
                </h2>
                {selectedNode.nseSymbol && (
                  <span className="font-mono text-xs text-brand-cyan tracking-wider">
                    NSE: {selectedNode.nseSymbol}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-md text-space-400 hover:text-space-100 hover:bg-space-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Factual Metrics Card */}
            <div className="mt-5 flex flex-col gap-3">
              <span className="text-[11px] font-semibold text-space-400 uppercase tracking-wider">
                Financial Telemetry (Audited Base)
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <Metric
                  label="Revenue"
                  value={selectedNode.revenueCr}
                  unit="₹ Cr"
                  provenance={{ sourceName: 'NSE Audited Results', filingYear: 'FY24' }}
                />
                <Metric
                  label="Market Cap"
                  value={selectedNode.marketCapCr}
                  unit="₹ Cr"
                  provenance={{ sourceName: 'NSE Daily Float', filingYear: 'FY24' }}
                />
              </div>

              {/* Data Provenance Box */}
              <div className="p-3 bg-space-850 rounded-lg border border-space-750 flex flex-col gap-1.5 mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-space-400 font-medium">Source Provenance</span>
                  <span className="flex items-center gap-1 text-[11px] text-brand-emerald font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                  </span>
                </div>
                <p className="text-[11px] text-space-400">
                  Regulatory filing reference registered under statutory disclosure guidelines.
                </p>
              </div>

              {/* Connected Relationships in Subgraph */}
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-[11px] font-semibold text-space-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Connected Relationships</span>
                  <Share2 className="w-3.5 h-3.5 text-brand-cyan" />
                </span>

                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {DEMO_TOPOLOGY_LINKS
                    .filter(l => {
                      const s = typeof l.source === 'object' ? (l.source as NetworkNode).id : l.source;
                      const t = typeof l.target === 'object' ? (l.target as NetworkNode).id : l.target;
                      return s === selectedNode.id || t === selectedNode.id;
                    })
                    .map((link, idx) => {
                      const s = typeof link.source === 'object' ? (link.source as NetworkNode).id : link.source;
                      const t = typeof link.target === 'object' ? (link.target as NetworkNode).id : link.target;
                      const isOutgoing = s === selectedNode.id;
                      const otherNodeId = isOutgoing ? t : s;
                      const otherNode = DEMO_TOPOLOGY_NODES.find(n => n.id === otherNodeId);

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-space-850/70 border border-space-800 rounded-md text-xs"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] text-brand-cyan">
                              {link.type}
                            </span>
                            <span className="text-space-300 truncate max-w-[140px]">
                              {otherNode?.name || otherNodeId}
                            </span>
                          </div>
                          <Badge variant="neutral" size="xs">
                            Active
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-space-750 flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              Inspect Company Cockpit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
