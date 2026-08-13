import React from 'react';
import { useReducedMotion } from 'framer-motion';
import FallingDroplet from './FallingDroplet';
import ImpactRipple from './ImpactRipple';
import ECGPulse from './ECGPulse';

// Photorealistic Hero Asset Path
import realisticHeroAsset from '../../assets/hero/lifepulse-hero-realistic.png';

export default function HeroVisual({ className = '' }) {
  const shouldReduceMotion = useReducedMotion();
  const DURATION = 3.6;

  return (
    <div className={`relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Ambient Radial Red Atmosphere Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/20 via-brand-crimson/5 to-transparent rounded-full blur-3xl transform scale-110 pointer-events-none" />
      <div className="absolute w-72 h-72 bg-brand-red/15 rounded-full blur-2xl animate-pulse pointer-events-none" />

      {/* Hero Visual Container with Seamless Dissolve Mask */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* LAYER 1: Realistic Hero Asset with Radial Edge Feathering Mask */}
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse 72% 72% at 50% 52%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 95%)',
            maskImage: 'radial-gradient(ellipse 72% 72% at 50% 52%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 95%)',
          }}
        >
          <img
            src={realisticHeroAsset}
            alt="LifePulse Realistic Hands Holding Glowing Blood Drop"
            className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition-transform duration-700 pointer-events-none"
          />

          {/* Midnight Navy Blend Vignette to match #081B3A perfectly */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 75% 75% at 50% 52%, transparent 30%, rgba(8, 27, 58, 0.4) 65%, #081B3A 98%)',
            }}
          />
        </div>

        {/* LAYER 2: Falling Blood Droplet Sequence */}
        <FallingDroplet duration={DURATION} shouldReduceMotion={shouldReduceMotion} />

        {/* LAYER 3: Impact Ripple at Merge Point */}
        <ImpactRipple duration={DURATION} shouldReduceMotion={shouldReduceMotion} />

        {/* LAYER 4: ECG Heartbeat Line Pulse */}
        <ECGPulse duration={DURATION} shouldReduceMotion={shouldReduceMotion} />
      </div>
    </div>
  );
}
