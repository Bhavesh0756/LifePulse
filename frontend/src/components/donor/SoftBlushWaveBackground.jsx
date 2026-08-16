import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function SoftBlushWaveBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none bg-gradient-to-b from-[#FFF0F3] via-[#FFE4E6] to-[#FFF5F7]">
      {/* SVG Wave Layers */}
      <svg
        className="absolute w-full h-full min-h-screen inset-0"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          {/* Wave Gradient 1 - Soft White to Blush */}
          <linearGradient id="blushWave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FFE4E6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FECDD3" stopOpacity="0.3" />
          </linearGradient>

          {/* Wave Gradient 2 - Translucent White Glow */}
          <linearGradient id="blushWave2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#FFF1F2" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFE4E6" stopOpacity="0.2" />
          </linearGradient>

          {/* Wave Gradient 3 - Deep Soft Rose Shadow */}
          <linearGradient id="blushWave3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFF1F2" stopOpacity="0.4" />
          </linearGradient>

          <filter id="softBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>

        {/* Static Background Soft Ambient Orbs */}
        <circle cx="10%" cy="15%" r="350" fill="#FFE4E6" opacity="0.7" filter="url(#softBlur)" />
        <circle cx="90%" cy="40%" r="450" fill="#FECDD3" opacity="0.5" filter="url(#softBlur)" />
        <circle cx="20%" cy="85%" r="400" fill="#FFF1F2" opacity="0.8" filter="url(#softBlur)" />

        {/* Wave 1 - Top Sweeping Organic White Band */}
        <motion.path
          d="M -100,120 C 300,280 700,-40 1100,160 C 1300,260 1500,120 1600,180 L 1600,-100 L -100,-100 Z"
          fill="url(#blushWave1)"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  d: [
                    "M -100,120 C 300,280 700,-40 1100,160 C 1300,260 1500,120 1600,180 L 1600,-100 L -100,-100 Z",
                    "M -100,150 C 350,220 650,10 1150,130 C 1350,220 1500,150 1600,200 L 1600,-100 L -100,-100 Z",
                    "M -100,120 C 300,280 700,-40 1100,160 C 1300,260 1500,120 1600,180 L 1600,-100 L -100,-100 Z",
                  ],
                }
          }
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Wave 2 - Center Flowing Organic Ribbon */}
        <motion.path
          d="M -100,450 C 250,320 600,580 950,420 C 1250,280 1450,480 1600,400 L 1600,950 L -100,950 Z"
          fill="url(#blushWave2)"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  d: [
                    "M -100,450 C 250,320 600,580 950,420 C 1250,280 1450,480 1600,400 L 1600,950 L -100,950 Z",
                    "M -100,400 C 300,380 550,500 1000,460 C 1200,340 1500,420 1600,440 L 1600,950 L -100,950 Z",
                    "M -100,450 C 250,320 600,580 950,420 C 1250,280 1450,480 1600,400 L 1600,950 L -100,950 Z",
                  ],
                }
          }
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Wave 3 - Bottom Soft Layer */}
        <motion.path
          d="M -100,750 C 400,650 800,850 1200,720 C 1400,650 1550,780 1600,750 L 1600,1050 L -100,1050 Z"
          fill="url(#blushWave3)"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  d: [
                    "M -100,750 C 400,650 800,850 1200,720 C 1400,650 1550,780 1600,750 L 1600,1050 L -100,1050 Z",
                    "M -100,720 C 450,690 750,800 1150,750 C 1350,700 1500,740 1600,780 L 1600,1050 L -100,1050 Z",
                    "M -100,750 C 400,650 800,850 1200,720 C 1400,650 1550,780 1600,750 L 1600,1050 L -100,1050 Z",
                  ],
                }
          }
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
