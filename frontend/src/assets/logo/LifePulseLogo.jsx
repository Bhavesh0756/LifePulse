import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { useReducedMotion } from 'framer-motion';

export default function LifePulseLogo({ 
  className = "", 
  variant = "default", // default | light | iconOnly
  size = "md"          // sm | md | lg
}) {
  const logoRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || !logoRef.current) return;
    
    // Scale in animation on load, followed by a continuous heartbeat pulse
    const tl = anime.timeline({
      easing: 'easeOutElastic(1, .8)',
    });
    
    tl.add({
      targets: logoRef.current,
      scale: [0, 1],
      opacity: [0, 1],
      duration: 1200,
    }).add({
      targets: logoRef.current,
      scale: [1, 1.05],
      duration: 1000,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true
    }, '-=200');
    
    return () => anime.remove(logoRef.current);
  }, [shouldReduceMotion]);

  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon Badge */}
      <div 
        ref={logoRef}
        className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-brand-red to-brand-crimson p-0.5 shadow-crimson-glow flex items-center justify-center relative overflow-hidden group`}
        style={!shouldReduceMotion ? { opacity: 0 } : {}}
      >
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5 text-white transition-transform duration-300"
        >
          {/* Blood drop silhouette */}
          <path 
            d="M16 3C16 3 7 14.5 7 20.5C7 25.1944 11.0294 29 16 29C20.9706 29 25 25.1944 25 20.5C25 14.5 16 3 16 3Z" 
            fill="currentColor" 
            fillOpacity="0.25"
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinejoin="round"
          />
          {/* ECG Pulse Line over Heart/Drop */}
          <path 
            d="M9 20H13L15 14L17 24L19 18L21 20H23" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {variant !== "iconOnly" && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-extrabold tracking-tight leading-none ${variant === "light" ? "text-white" : "text-brand-navy"}`}>
            Life<span className="text-brand-red">Pulse</span>
          </span>
          <span className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${variant === "light" ? "text-slate-300" : "text-brand-slate"}`}>
            HealthTech
          </span>
        </div>
      )}
    </div>
  );
}
