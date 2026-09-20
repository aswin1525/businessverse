import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ShieldCheck, HelpCircle } from 'lucide-react';

export interface MetricProps {
  label: string;
  value?: string | number | null;
  unit?: string;
  change?: {
    value: number;
    period?: string;
    isPositive?: boolean;
  };
  provenance?: {
    sourceName: string;
    filingYear?: string;
    isAudited?: boolean;
  };
  isUnavailable?: boolean;
  className?: string;
}

export const Metric: React.FC<MetricProps> = ({
  label,
  value,
  unit = '₹ Cr',
  change,
  provenance,
  isUnavailable = false,
  className,
}) => {
  const formatValue = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined || isUnavailable) {
      return '—';
    }
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }).format(val);
    }
    return String(val);
  };

  return (
    <div className={twMerge(clsx('flex flex-col gap-1 p-3.5 bg-space-900/80 border border-space-750 rounded-lg', className))}>
      {/* Metric Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium tracking-wider text-space-400 uppercase">
          {label}
        </span>
        {provenance ? (
          <div
            className="flex items-center gap-1 text-[10px] text-brand-emerald/90 bg-brand-emerald/10 px-1.5 py-0.5 rounded cursor-help"
            title={`Source: ${provenance.sourceName} (${provenance.filingYear || 'Audited'})`}
          >
            <ShieldCheck className="w-3 h-3 text-brand-emerald" />
            <span className="font-mono">VERIFIED</span>
          </div>
        ) : (
          <div
            className="flex items-center text-[10px] text-space-500 cursor-help"
            title="Standard Reported Metric"
          >
            <HelpCircle className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-1.5 my-0.5">
        <span className="font-mono text-2xl font-bold tracking-tight text-space-50">
          {formatValue(value)}
        </span>
        {value !== null && value !== undefined && !isUnavailable && (
          <span className="text-xs font-semibold text-space-400 font-mono">
            {unit}
          </span>
        )}
      </div>

      {/* Footer / Delta & Provenance detail */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-space-800/80">
        {change ? (
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span
              className={clsx(
                'font-medium',
                change.value >= 0 ? 'text-brand-emerald' : 'text-rose-400'
              )}
            >
              {change.value >= 0 ? '+' : ''}{change.value}%
            </span>
            <span className="text-space-500 text-[10px]">
              {change.period || 'YoY'}
            </span>
          </div>
        ) : isUnavailable ? (
          <span className="text-[10px] text-space-500 italic">
            Data unavailable for period
          </span>
        ) : (
          <span className="text-[10px] text-space-500">
            Official Filing
          </span>
        )}

        {provenance?.filingYear && (
          <span className="text-[10px] font-mono text-space-400">
            {provenance.filingYear}
          </span>
        )}
      </div>
    </div>
  );
};
