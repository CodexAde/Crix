import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-95";

  const variants = {
    primary: "bg-accent text-white hover:opacity-90 shadow-soft hover:shadow-strong",
    secondary: "border shadow-soft hover:opacity-80",
    ghost: "hover:opacity-80",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  const getVariantStyles = () => {
    if (variant === 'secondary') {
      return {
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-soft)',
        color: 'var(--text-primary)',
      };
    }
    if (variant === 'ghost') {
      return {
        color: 'var(--text-secondary)',
      };
    }
    return {};
  };

  return (
    <button
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      style={getVariantStyles()}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

