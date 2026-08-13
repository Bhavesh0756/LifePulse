import React from 'react';
import { motion } from 'framer-motion';

export default function FallingDroplet({ duration = 3.6, shouldReduceMotion = false }) {
  if (shouldReduceMotion) return null;

  return (
    <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-8 h-10 pointer-events-none z-20">
      <motion.div
        initial={{ y: -120, scale: 0.2, opacity: 0 }}
        animate={{
          // Sequence:
          // 0.0s: hidden
          // 0.3s (8.3%): form at top (y: -120px)
          // 0.5s (13.8%): appear & start fall
          // 1.5s (41.6%): reach top tip of main drop (y: 110px)
          // 1.8s (50.0%): merge into main drop (y: 120px, scale 0.15, opacity 0)
          // 1.8s - 3.6s: reset hidden
          y: [-120, -120, -110, 110, 120, 120],
          scale: [0.2, 0.85, 1.0, 1.05, 0.15, 0.15],
          scaleY: [0.5, 1.0, 1.0, 1.35, 0.3, 0.3], // natural fluid teardrop elongation during acceleration
          opacity: [0, 0.9, 1.0, 1.0, 0, 0],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          times: [0, 0.083, 0.138, 0.416, 0.500, 1],
          ease: ["easeOut", "linear", "easeIn", "easeOut", "linear"],
        }}
        className="w-full h-full"
      >
        {/* Realistic 3D Glossy Droplet SVG */}
        <svg viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="fallingDropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4D6D" />
              <stop offset="60%" stopColor="#E0143E" />
              <stop offset="100%" stopColor="#800920" />
            </linearGradient>
            <filter id="fallingDropGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Droplet Silhouette */}
          <path
            d="M16 2C16 2 2 20 2 30C2 36.6274 8.26801 42 16 42C23.732 42 30 36.6274 30 30C30 20 16 2 16 2Z"
            fill="url(#fallingDropGrad)"
            filter="url(#fallingDropGlow)"
          />

          {/* Realistic Specular Gloss Curve */}
          <path
            d="M12 18C10 22 8.5 26 8.5 30"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.65"
          />
        </svg>
      </motion.div>
    </div>
  );
}
