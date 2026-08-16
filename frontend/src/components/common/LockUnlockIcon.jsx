import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function LockUnlockIcon({ isUnlocked = false, className = 'w-6 h-6' }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <motion.path 
        animate={
          shouldReduceMotion
            ? {}
            : isUnlocked
            ? { translateY: -3, rotate: -20 }
            : { translateY: 0, rotate: 0 }
        }
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        d="M7 11V7a5 5 0 0 1 10 0v4" 
        style={{ transformOrigin: '7px 11px' }}
      />
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    </svg>
  );
}
