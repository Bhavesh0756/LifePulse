import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function SkeletonRow({ count = 3, type = 'card' }) {
  const items = Array.from({ length: count });
  const shouldReduceMotion = useReducedMotion();

  const shimmerVariant = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: { repeat: Infinity, duration: 1.5, ease: 'linear' },
    },
  };

  const ShimmerOverlay = () => {
    if (shouldReduceMotion) return null;
    return (
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        }}
        variants={shimmerVariant}
        initial="initial"
        animate="animate"
      />
    );
  };

  if (type === 'table') {
    return (
      <>
        {items.map((_, i) => (
          <tr key={i} className="border-b border-slate-100 relative overflow-hidden">
            <td className="py-4 px-4 relative overflow-hidden bg-slate-50"><div className="h-4 bg-slate-200 rounded-lg w-3/4 relative z-0" /><ShimmerOverlay /></td>
            <td className="py-4 px-4 relative overflow-hidden bg-slate-50"><div className="h-4 bg-slate-200 rounded-lg w-1/2 mx-auto relative z-0" /><ShimmerOverlay /></td>
            <td className="py-4 px-4 relative overflow-hidden bg-slate-50"><div className="h-4 bg-slate-200 rounded-lg w-1/2 mx-auto relative z-0" /><ShimmerOverlay /></td>
            <td className="py-4 px-4 relative overflow-hidden bg-slate-50"><div className="h-4 bg-slate-200 rounded-lg w-1/3 ml-auto relative z-0" /><ShimmerOverlay /></td>
          </tr>
        ))}
      </>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
          <ShimmerOverlay />
          <div className="flex justify-between items-center relative z-0">
            <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
            <div className="h-4 bg-slate-200 rounded-lg w-1/6" />
          </div>
          <div className="h-3 bg-slate-200 rounded-lg w-2/3 relative z-0" />
          <div className="h-8 bg-slate-100 rounded-xl w-full relative z-0" />
        </div>
      ))}
    </div>
  );
}
