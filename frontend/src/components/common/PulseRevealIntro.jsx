import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LifePulseLogo from '../../assets/logo/LifePulseLogo';

export default function PulseRevealIntro({ onComplete }) {
  // Stages:
  // 'point'  (0.0 - 0.5s)
  // 'ecg'    (0.5 - 1.2s)
  // 'flow'   (1.2 - 2.0s)
  // 'brand'  (2.0 - 2.6s)
  // 'expand' (2.6 - 3.4s)
  // 'complete' (3.4s+)
  const [stage, setStage] = useState('point');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenIntro = sessionStorage.getItem('lifepulse_signature_intro_shown');

    if (prefersReducedMotion || hasSeenIntro) {
      if (onComplete) onComplete();
      return;
    }

    // Cinematic Pacing Timeline (Total ~3.5s - 3.8s)
    const timer1 = setTimeout(() => setStage('ecg'), 500);
    const timer2 = setTimeout(() => setStage('flow'), 1200);
    const timer3 = setTimeout(() => setStage('brand'), 2000);
    const timer4 = setTimeout(() => setStage('expand'), 2600);
    const timer5 = setTimeout(() => {
      sessionStorage.setItem('lifepulse_signature_intro_shown', 'true');
      if (onComplete) onComplete();
    }, 3400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  const smoothEase = [0.25, 1, 0.5, 1]; // Smooth cinematic ease-out curve

  return (
    <AnimatePresence>
      {stage !== 'complete' && (
        <motion.div
          key="signature-intro-canvas"
          initial={{ opacity: 1 }}
          animate={{ opacity: stage === 'expand' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="fixed inset-0 z-[9999] bg-[#050E1F] text-white flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
        >
          {/* Ambient Crimson Aura & Expanding Glow */}
          <motion.div
            animate={{
              scale:
                stage === 'point'
                  ? [0.8, 1.15, 0.95]
                  : stage === 'ecg'
                  ? [0.95, 1.45, 1.15]
                  : stage === 'flow'
                  ? [1.15, 1.85, 1.5]
                  : stage === 'brand'
                  ? [1.5, 2.3, 2.1]
                  : [2.1, 5.0],
              opacity:
                stage === 'point'
                  ? 0.35
                  : stage === 'ecg'
                  ? 0.65
                  : stage === 'flow'
                  ? 0.75
                  : stage === 'brand'
                  ? 0.9
                  : 0,
            }}
            transition={{ duration: stage === 'expand' ? 0.8 : 0.6, ease: smoothEase }}
            className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-brand-red/40 via-brand-crimson/30 to-rose-600/20 blur-3xl pointer-events-none"
          />

          {/* STAGE 1 (0.0s - 0.5s): Initial Glowing Center Point */}
          {stage === 'point' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.7, 1.25, 1.0], opacity: [0.3, 1, 0.85] }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="relative w-4 h-4 rounded-full bg-brand-red shadow-[0_0_28px_#D7193F]"
            >
              <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-50" />
            </motion.div>
          )}

          {/* STAGE 2 (0.5s - 1.2s) & STAGE 3 (1.2s - 2.0s): Heartbeat + ECG & Blood Flow */}
          {(stage === 'ecg' || stage === 'flow') && (
            <div className="relative flex items-center justify-center w-full max-w-lg px-6">
              <svg
                className="w-full h-32 overflow-visible"
                viewBox="0 0 400 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Guide background path */}
                <path
                  d="M 10 60 L 120 60 L 140 25 L 160 95 L 180 10 L 200 110 L 220 45 L 240 70 L 260 60 L 390 60"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Primary Heartbeat ECG Line Drawing */}
                <motion.path
                  d="M 10 60 L 120 60 L 140 25 L 160 95 L 180 10 L 200 110 L 220 45 L 240 70 L 260 60 L 390 60"
                  stroke="#D7193F"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: smoothEase }}
                  style={{ filter: 'drop-shadow(0 0 12px rgba(215, 25, 63, 0.95))' }}
                />

                {/* Vascular Blood Flow Light Trails (Stage 3: 1.2s - 2.0s) */}
                {stage === 'flow' && (
                  <>
                    <motion.path
                      d="M 140 25 Q 180 -10 240 40 T 390 60"
                      stroke="url(#crimsonFluidGradSlow)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.9 }}
                      transition={{ duration: 0.75, ease: smoothEase }}
                    />
                    <motion.path
                      d="M 160 95 Q 200 130 260 80 T 390 60"
                      stroke="url(#crimsonFluidGradSlow)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.75 }}
                      transition={{ duration: 0.75, delay: 0.1, ease: smoothEase }}
                    />
                  </>
                )}

                <defs>
                  <linearGradient id="crimsonFluidGradSlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D7193F" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#FF4D6D" stopOpacity="1" />
                    <stop offset="100%" stopColor="#A80F2D" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}

          {/* STAGE 4 (2.0s - 2.6s) & STAGE 5 (2.6s - 3.4s): LifePulse Brand Reveal & Glow Expansion */}
          {(stage === 'brand' || stage === 'expand') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 10 }}
              animate={{ opacity: stage === 'expand' ? 0.95 : 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="relative flex flex-col items-center z-10"
            >
              <div className="relative">
                <LifePulseLogo variant="light" size="lg" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.85, 0], scale: [0.5, 1.45, 1.9] }}
                  transition={{ duration: 0.8, ease: smoothEase }}
                  className="absolute inset-0 rounded-full bg-brand-red/35 blur-2xl pointer-events-none"
                />
              </div>

              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: smoothEase }}
                className="text-[11px] font-extrabold tracking-[0.3em] uppercase text-rose-300/90 mt-3.5"
              >
                Connecting Lives. Saving Lives.
              </motion.span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
