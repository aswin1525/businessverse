import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-space-300 tracking-wide uppercase">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-space-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              'w-full bg-space-900 border border-space-700 rounded-md py-2 px-3 text-sm text-space-100 placeholder:text-space-500 transition-colors',
              'focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/50',
              'disabled:bg-space-950 disabled:border-space-800 disabled:text-space-600 disabled:cursor-not-allowed',
              leftIcon ? 'pl-9' : '',
              rightIcon ? 'pr-9' : '',
              error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/50' : '',
              className
            )
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 text-space-400 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-400 font-normal">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-space-500 font-normal">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
