import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function AnimatedCheckmark({ color = '#16A34A', size = 52, className = '' }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg width={size} height={size} viewBox="0 0 52 52" className={`block ${className}`}>
      <circle cx="26" cy="26" r="24" fill="none" stroke={color} strokeWidth="2.5" opacity="0.2" />
      {shouldReduceMotion ? (
        <path
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 27l7 7 16-16"
        />
      ) : (
        <motion.path
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 27l7 7 16-16"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        />
      )}
    </svg>
  );
}
