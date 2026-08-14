import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function RadarPing({ color = '#EF4444', size = 60, children }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className="relative">{children}</div>;
  }

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="absolute rounded-full"
        style={{ width: size, height: size, border: `2px solid ${color}` }}
        initial={{ opacity: 0.8, scale: 0.5 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: size, height: size, border: `2px solid ${color}` }}
        initial={{ opacity: 0.8, scale: 0.5 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{
          duration: 2,
          delay: 1,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
