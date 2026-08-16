import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function RadarPing({ color = '#D7193F', size = 48, children }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className="relative inline-block">{children}</div>;
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: size, height: size, border: `2px solid ${color}` }}
        initial={{ opacity: 0.8, scale: 0.5 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: size, height: size, border: `2px solid ${color}` }}
        initial={{ opacity: 0.8, scale: 0.5 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{
          duration: 2.2,
          delay: 1.1,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
