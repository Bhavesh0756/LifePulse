import React from 'react';
import { cn } from '../utils';

export default function Card({
  children,
  variant = 'default', // default | elevated | glass | dark | interactive | borderAccent
  className = '',
  onClick,
  ...props
}) {
  const variantStyles = {
    default: 'bg-white border border-slate-200/80 shadow-card text-brand-navy hover-crimson-card',
    elevated: 'bg-white border border-slate-100 shadow-card-hover text-brand-navy hover-crimson-card',
    glass: 'glass-panel text-brand-navy hover-crimson-card',
    dark: 'glass-dark text-white hover-crimson-card',
    interactive: 'bg-white border border-slate-200/80 shadow-card hover-crimson-card cursor-pointer text-brand-navy',
    borderAccent: 'bg-white border-l-4 border-l-brand-red border-y border-r border-slate-200/80 shadow-card text-brand-navy hover-crimson-card',
  };

  return (
    <div
      className={cn('rounded-2xl p-6 transition-all duration-300', variantStyles[variant], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
