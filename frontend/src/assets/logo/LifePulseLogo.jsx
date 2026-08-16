import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function LifePulseLogo({ 
  className = "", 
  variant = "default", // default | light | iconOnly
  size = "md"          // sm | md | lg
}) {
  const shouldReduceMotion = useReducedMotion();

  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon Badge with Subtle Breathing Pulse */}
      <motion.div
        animate={shouldReduceMotion ? {} : { scale: [1, 1.04, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-brand-red to-brand-crimson p-0.5 shadow-crimson-glow flex items-center justify-center relative overflow-hidden group`}
      >
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5 text-white transform group-hover:scale-105 transition-transform duration-300"
        >
          {/* Blood drop silhouette */}
          <path 
            d="M16 3C16 3 7 14.5 7 20.5C7 25.1944 11.0294 29 16 29C20.9706 29 25 25.1944 25 20.5C25 14.5 16 3 16 3Z" 
            fill="currentColor" 
            fillOpacity="0.25"
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinejoin="round"
          />
          {/* ECG Pulse Line over Heart/Drop */}
          <path 
            d="M9 20H13L15 14L17 24L19 18L21 20H23" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* Brand Text */}
      {variant !== "iconOnly" && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-extrabold tracking-tight leading-none ${variant === "light" ? "text-white" : "text-brand-navy"}`}>
            Life<span className="text-brand-red">Pulse</span>
          </span>
          <span className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${variant === "light" ? "text-slate-300" : "text-brand-slate"}`}>
            HealthTech
          </span>
        </div>
      )}
    </div>
  );
}
