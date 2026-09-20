import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  glow?: 'cyan' | 'emerald' | 'violet' | 'none';
}

export const Panel: React.FC<PanelProps> = ({
  children,
  title,
  subtitle,
  badge,
  actions,
  glow = 'none',
  className,
  ...props
}) => {
  const glowClasses = {
    none: '',
    cyan: 'shadow-glow-cyan/10 border-brand-cyan/30',
    emerald: 'shadow-glow-emerald/10 border-brand-emerald/30',
    violet: 'shadow-glow-violet/10 border-brand-violet/30',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'bg-space-850/90 backdrop-blur-md border border-space-700/80 rounded-xl p-5 transition-all duration-200',
          glowClasses[glow],
          className
        )
      )}
      {...props}
    >
      {(title || actions || badge) && (
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-space-700/50">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2.5">
              {typeof title === 'string' ? (
                <h3 className="text-sm font-semibold tracking-wide text-space-100 uppercase">
                  {title}
                </h3>
              ) : (
                title
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-space-400 font-normal">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};
