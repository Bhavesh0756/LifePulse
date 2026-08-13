import React from 'react';
import { cn } from '../utils';

export function Button({
  children,
  variant = 'primary', // primary | secondary | outline | ghost | danger
  size = 'md',          // sm | md | lg
  className = '',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_6px_20px_-2px_rgba(225,29,72,0.22)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red/40 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variantStyles = {
    primary: 'bg-brand-red text-white hover:bg-brand-crimson focus:ring-brand-red shadow-crimson-glow active:scale-[0.98]',
    secondary: 'bg-brand-navy text-white hover:bg-brand-slate focus:ring-brand-navy shadow-card active:scale-[0.98]',
    outline: 'border border-slate-300 text-brand-navy hover:bg-slate-50 hover:border-brand-red/50 focus:ring-brand-navy active:scale-[0.98]',
    ghost: 'text-brand-navy hover:bg-rose-50/60 hover:text-brand-red focus:ring-slate-300',
    danger: 'bg-brand-danger text-white hover:bg-red-700 focus:ring-brand-danger active:scale-[0.98]',
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}

export function SecondaryButton(props) {
  return <Button variant="secondary" {...props} />;
}
