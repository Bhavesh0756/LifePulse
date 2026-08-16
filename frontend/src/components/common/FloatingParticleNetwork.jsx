import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function FloatingParticleNetwork({ className = '' }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  const nodes = [
    { id: 1, cx: '15%', cy: '25%' },
    { id: 2, cx: '35%', cy: '15%' },
    { id: 3, cx: '25%', cy: '45%' },
    { id: 4, cx: '75%', cy: '20%' },
    { id: 5, cx: '85%', cy: '40%' },
    { id: 6, cx: '65%', cy: '60%' },
    { id: 7, cx: '20%', cy: '75%' },
    { id: 8, cx: '45%', cy: '80%' },
    { id: 9, cx: '80%', cy: '85%' },
    { id: 10, cx: '50%', cy: '50%' },
  ];

  const connections = [
    [1, 2], [1, 3], [2, 3], [3, 10], [2, 10],
    [4, 5], [4, 10], [5, 6], [6, 10], [7, 8],
    [8, 10], [7, 3], [8, 9], [9, 6]
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full opacity-50">
        <defs>
          <radialGradient id="particleNodeGlow">
            <stop offset="0%" stopColor="#D7193F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D7193F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Pulsing Connection Lines */}
        {connections.map((conn, i) => {
          const n1 = nodes.find((n) => n.id === conn[0]);
          const n2 = nodes.find((n) => n.id === conn[1]);
          return (
            <motion.line
              key={`conn-${i}`}
              x1={n1.cx}
              y1={n1.cy}
              x2={n2.cx}
              y2={n2.cy}
              stroke="#D7193F"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              animate={{ opacity: [0.1, 0.45, 0.1] }}
              transition={{
                duration: 3.5 + (i % 3),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          );
        })}

        {/* Floating Donor Nodes */}
        {nodes.map((n, i) => (
          <motion.g
            key={`node-${n.id}`}
            animate={{
              y: [0, (i % 2 === 0 ? -12 : 12), 0],
              x: [0, (i % 3 === 0 ? 10 : -10), 0],
            }}
            transition={{
              duration: 4 + (i % 4),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          >
            <circle cx={n.cx} cy={n.cy} r="14" fill="url(#particleNodeGlow)" className="opacity-40" />
            <circle cx={n.cx} cy={n.cy} r="2.5" fill="#D7193F" />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
