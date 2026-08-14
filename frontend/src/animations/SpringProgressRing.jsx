import React, { useEffect } from 'react';
import { motion, useSpring, useTransform, useInView, useReducedMotion } from 'framer-motion';

export default function SpringProgressRing({ 
  progress, 
  size = 64, 
  strokeWidth = 6, 
  color = '#10B981', 
  className = '' 
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
  const shouldReduceMotion = useReducedMotion();
  
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  
  const springProgress = useSpring(0, {
    stiffness: 45,
    damping: 12,
    mass: 1,
  });

  const strokeDashoffset = useTransform(springProgress, (val) => {
    return circumference - (val / 100) * circumference;
  });

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (isInView) {
      springProgress.set(progress);
    }
  }, [isInView, progress, springProgress, shouldReduceMotion]);

  const targetOffset = circumference - (progress / 100) * circumference;

  return (
    <div ref={ref} className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        {shouldReduceMotion ? (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={targetOffset}
          />
        ) : (
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ strokeDasharray: circumference, strokeDashoffset }}
          />
        )}
      </svg>
      <div className="absolute flex items-baseline">
        <span className="text-lg font-black text-brand-navy">{progress}</span>
      </div>
    </div>
  );
}
