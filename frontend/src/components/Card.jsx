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
    default: 'bg-white border border-slate-200/80 shadow-card text-brand-navy',
    elevated: 'bg-white border border-slate-100 shadow-card-hover text-brand-navy',
    glass: 'glass-panel text-brand-navy',
    dark: 'glass-dark text-white',
    interactive: 'bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-brand-red/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-brand-navy',
    borderAccent: 'bg-white border-l-4 border-l-brand-red border-y border-r border-slate-200/80 shadow-card text-brand-navy',
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
