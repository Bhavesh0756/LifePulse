import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function ECGPulse({ duration = 3.6, shouldReduceMotion = false }) {
  const pathRef = useRef(null);
  
  useEffect(() => {
    if (shouldReduceMotion || !pathRef.current) return;
    
    // Create an infinite loop timeline for the heartbeat line drawing itself
    const timeline = anime.timeline({
      loop: true,
    });
    
    // Draw the path using strokeDashoffset and manipulate opacity for a smooth enter/exit
    timeline.add({
      targets: pathRef.current,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: (duration * 1000) * 0.45, // roughly 45% of the total duration to draw
      delay: (duration * 1000) * 0.45,    // wait before drawing again
      opacity: [
        { value: [0, 1], duration: 300 },
        { value: 1, duration: (duration * 1000) * 0.45 - 600 },
        { value: 0, duration: 300 }
      ]
    });
    
    return () => {
      anime.remove(pathRef.current);
    }
  }, [duration, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  const ecgPath = "M10 30 H50 L62 10 L75 52 L88 8 L98 30 H140";

  return (
    <div className="absolute top-[52.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-16 pointer-events-none z-25">
      <svg viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <filter id="ecgFlashGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Animated Bright White Heartbeat Stroke using AnimeJS */}
        <path
          ref={pathRef}
          d={ecgPath}
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ecgFlashGlow)"
          style={{ opacity: 0 }}
        />
      </svg>
    </div>
  );
}
