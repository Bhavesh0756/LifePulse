import React from 'react';
import { motion } from 'framer-motion';

export default function ImpactRipple({ duration = 3.6, shouldReduceMotion = false }) {
  if (shouldReduceMotion) return null;

  return (
    <div className="absolute top-[37%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 pointer-events-none z-15">
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{
          // Sequence:
          // 0s -> 1.8s (50%): hidden
          // 1.8s (50%): impact starts, scale 0.4, opacity 0.85
          // 2.2s (61.1%): expanded & faded out
          // 2.2s -> 3.6s: hidden
          opacity: [0, 0, 0.85, 0],
          scale: [0.3, 0.3, 2.2, 3.8],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          times: [0, 0.495, 0.53, 0.611],
          ease: "easeOut",
        }}
        className="w-full h-full rounded-full border-2 border-brand-red shadow-[0_0_15px_rgba(255,77,109,0.8)]"
      />
    </div>
  );
}
