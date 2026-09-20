import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'blue' | 'rose' | 'neutral';
  size?: 'xs' | 'sm' | 'md';
  hasDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  hasDot = false,
  className,
  ...props
}) => {
  const variants = {
    neutral: 'bg-space-800 text-space-300 border-space-700',
    cyan: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30',
    emerald: 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30',
    violet: 'bg-brand-violet/10 text-brand-violet border-brand-violet/30',
    amber: 'bg-brand-amber/10 text-brand-amber border-brand-amber/30',
    blue: 'bg-brand-blue/10 text-brand-blue border-brand-blue/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const dotColors = {
    neutral: 'bg-space-400',
    cyan: 'bg-brand-cyan',
    emerald: 'bg-brand-emerald',
    violet: 'bg-brand-violet',
    amber: 'bg-brand-amber',
    blue: 'bg-brand-blue',
    rose: 'bg-rose-400',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium tracking-wide',
    sm: 'text-xs px-2.5 py-0.5 font-medium tracking-normal',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 border rounded-full select-none',
          variants[variant],
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {hasDot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />
      )}
      {children}
    </span>
  );
};
