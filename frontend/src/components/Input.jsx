import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={twMerge(
          "flex h-12 w-full rounded-2xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: error ? undefined : 'var(--border-soft)',
          color: 'var(--text-primary)',
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 ml-1">{error}</p>
      )}
    </div>
  );
});

