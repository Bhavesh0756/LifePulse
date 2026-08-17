import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ECGPulse({ duration = 3.6, shouldReduceMotion: propReduceMotion = false, className = '' }) {
  const systemReduceMotion = useReducedMotion();
  const shouldReduceMotion = propReduceMotion || systemReduceMotion;

  if (shouldReduceMotion) return null;

  const ecgPath = "M10 30 H50 L62 10 L75 52 L88 8 L98 30 H140";

  return (
    <div className={`absolute top-[52.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-[26px] pointer-events-none z-25 ${className}`}>
      <svg viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <filter id="ecgFlashGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated Bright White Heartbeat Stroke */}
        <motion.path
          d={ecgPath}
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ecgFlashGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.45, 0.85, 1],
          }}
        />
      </svg>
    </div>
  );
}
