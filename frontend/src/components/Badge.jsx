import React from 'react';
import { cn } from '../utils';

export function Badge({
  children,
  variant = 'neutral', // success | warning | danger | info | neutral | brand
  size = 'md',          // sm | md
  className = '',
  icon: Icon,
  pulse = false,
}) {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    info: 'bg-blue-50 text-blue-700 border-blue-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/80',
    brand: 'bg-brand-red/10 text-brand-red border-brand-red/20',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[11px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        pulse && variant === 'danger' && 'animate-pulse-subtle border-brand-red/40',
        className
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

export function StatusBadge({ status, className = '' }) {
  const statusMap = {
    Available: { label: 'Available', variant: 'success', pulse: false },
    Verified: { label: 'Verified Hospital', variant: 'info', pulse: false },
    Emergency: { label: 'Emergency Required', variant: 'danger', pulse: true },
    CRITICAL: { label: 'CRITICAL TRAUMA', variant: 'danger', pulse: true },
    URGENT: { label: 'URGENT', variant: 'warning', pulse: false },
    NORMAL: { label: 'NORMAL', variant: 'neutral', pulse: false },
    Pending: { label: 'Pending Consent', variant: 'warning', pulse: false },
    Fulfilled: { label: 'Request Fulfilled', variant: 'success', pulse: false },
  };

  const config = statusMap[status] || { label: status, variant: 'neutral', pulse: false };

  return (
    <Badge variant={config.variant} pulse={config.pulse} className={className}>
      {config.label}
    </Badge>
  );
}
