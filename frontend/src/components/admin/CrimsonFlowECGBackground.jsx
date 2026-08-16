import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function CrimsonFlowECGBackground() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0 select-none opacity-25">
        <svg className="w-full h-full text-brand-red" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path
            d="M 0 200 Q 360 120 720 200 T 1440 200 V 0 H 0 Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path
            d="M 0 220 L 500 220 L 520 170 L 535 270 L 550 110 L 565 240 L 580 190 L 600 220 L 1440 220"
            stroke="currentColor"
            strokeWidth="3"
            strokeOpacity="0.4"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0 select-none">
      {/* Background SVG Canvas Layer */}
      <svg
        className="w-full h-full text-brand-red overflow-visible"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="crimsonGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E11D48" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#BE123C" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#881337" stopOpacity="0.08" />
          </linearGradient>

          <linearGradient id="crimsonGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.18" />
            <stop offset="60%" stopColor="#E11D48" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#9F1239" stopOpacity="0.05" />
          </linearGradient>

          <filter id="ecgGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* FLUID WAVE LAYER 1: Top Flowing Fluid */}
        <g>
          <motion.path
            d="M 0 180 Q 480 90 960 180 T 1920 180 T 2880 180 V 0 H 0 Z"
            fill="url(#crimsonGradient1)"
            animate={{ x: [-480, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
          />
        </g>

        {/* FLUID WAVE LAYER 2: Middle Deep Crimson Stream */}
        <g>
          <motion.path
            d="M 0 340 Q 520 250 1040 340 T 2080 340 T 3120 340 V 0 H 0 Z"
            fill="url(#crimsonGradient2)"
            animate={{ x: [0, -520] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          />
        </g>

        {/* FLUID WAVE LAYER 3: Bottom Upward Fluid Wave */}
        <g>
          <motion.path
            d="M 0 780 Q 460 700 920 780 T 1840 780 T 2760 780 V 1080 H 0 Z"
            fill="url(#crimsonGradient1)"
            animate={{ x: [-460, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
        </g>

        {/* INTEGRATED ECG HEARTBEAT WAVEFORM LAYER */}
        <g filter="url(#ecgGlow)">
          {/* Main Integrated ECG Path */}
          <motion.path
            d="M 0 240 L 400 240 L 420 240 L 430 190 L 440 280 L 455 120 L 470 260 L 485 210 L 495 240 L 960 240 L 1360 240 L 1380 240 L 1390 190 L 1400 280 L 1415 120 L 1430 260 L 1445 210 L 1455 240 L 1920 240"
            stroke="#E11D48"
            strokeWidth="3.5"
            strokeOpacity="0.55"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0.3, pathOffset: 0 }}
            animate={{
              pathOffset: [0, 1],
              strokeOpacity: [0.45, 0.75, 0.45],
            }}
            transition={{
              pathOffset: { duration: 7, repeat: Infinity, ease: 'linear' },
              strokeOpacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          />

          {/* Secondary Faint Travelling Pulse Shadow for Depth */}
          <motion.path
            d="M 0 240 L 400 240 L 420 240 L 430 190 L 440 280 L 455 120 L 470 260 L 485 210 L 495 240 L 960 240 L 1360 240 L 1380 240 L 1390 190 L 1400 280 L 1415 120 L 1430 260 L 1445 210 L 1455 240 L 1920 240"
            stroke="#F43F5E"
            strokeWidth="6"
            strokeOpacity="0.25"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0.2, pathOffset: 0 }}
            animate={{ pathOffset: [0, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          />
        </g>
      </svg>
    </div>
  );
}
