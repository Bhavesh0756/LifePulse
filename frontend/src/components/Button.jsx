import React, { useRef, useEffect } from 'react';
import { cn } from '../utils';
import gsap from 'gsap';
import { useReducedMotion } from 'framer-motion';

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
  const buttonRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = buttonRef.current;
    if (!el || shouldReduceMotion || disabled) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * 0.12,
        y: y * 0.12,
        ease: 'power2.out',
        duration: 0.3,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        ease: 'power2.out',
        duration: 0.4,
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [shouldReduceMotion, disabled]);

  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red/40 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] transform-gpu';

  const variantStyles = {
    primary: 'bg-brand-red text-white hover:bg-brand-crimson focus:ring-brand-red shadow-crimson-glow hover-crimson-btn',
    secondary: 'bg-brand-navy text-white hover:bg-brand-slate focus:ring-brand-navy shadow-card hover:shadow-lg',
    outline: 'border border-slate-300 text-brand-navy hover:bg-slate-50 hover:border-brand-red/50 hover:text-brand-red focus:ring-brand-navy',
    ghost: 'text-brand-navy hover:bg-rose-50/70 hover:text-brand-red focus:ring-slate-300',
    danger: 'bg-brand-danger text-white hover:bg-red-700 focus:ring-brand-danger shadow-sm hover-crimson-btn',
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />}
    </button>
  );
}

export function SecondaryButton(props) {
  return <Button variant="secondary" {...props} />;
}
