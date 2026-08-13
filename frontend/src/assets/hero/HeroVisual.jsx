import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroVisual({ className = '' }) {
  const shouldReduceMotion = useReducedMotion();

  // ECG Pulse Path inside the main blood drop
  const ecgPath = "M168 235 H182 L188 214 L196 256 L204 224 L210 235 H232";

  // Total loop duration in seconds
  const DURATION = 3.8;

  return (
    <div className={`relative w-full max-w-md mx-auto aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Background Radiant Atmosphere Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/25 via-brand-crimson/10 to-transparent rounded-full blur-3xl transform scale-95" />
      <div className="absolute w-60 h-60 bg-brand-red/15 rounded-full blur-2xl animate-pulse" />

      {/* Main Vector SVG Canvas */}
      <div className="relative w-full h-full p-2 flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-2xl"
        >
          <defs>
            {/* Realistic Warm Hand Gradients */}
            <linearGradient id="handSkinLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E29578" />
              <stop offset="45%" stopColor="#C86D51" />
              <stop offset="85%" stopColor="#8D3C25" />
              <stop offset="100%" stopColor="#4D190E" />
            </linearGradient>

            <linearGradient id="handSkinRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E29578" />
              <stop offset="45%" stopColor="#C86D51" />
              <stop offset="85%" stopColor="#8D3C25" />
              <stop offset="100%" stopColor="#4D190E" />
            </linearGradient>

            {/* Rich Liquid Blood Drop 3D Gradient */}
            <linearGradient id="mainBloodGrad" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FF385C" />
              <stop offset="35%" stopColor="#E0143E" />
              <stop offset="75%" stopColor="#A80F2D" />
              <stop offset="100%" stopColor="#5E0315" />
            </linearGradient>

            {/* Droplet Gradient */}
            <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5C7A" />
              <stop offset="100%" stopColor="#D7193F" />
            </linearGradient>

            {/* Glowing Base Shadow */}
            <radialGradient id="baseGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF2E55" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#D7193F" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#081B3A" stopOpacity="0" />
            </radialGradient>

            {/* Soft Glow Filter */}
            <filter id="dropGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* ECG Pulse Glow Filter */}
            <filter id="pulseGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* LAYER 1: Radiant Base Glow under the Blood Drop */}
          <ellipse cx="200" cy="275" rx="65" ry="18" fill="url(#baseGlow)" />

          {/* LAYER 2: Realistic Cupped Hands holding the Blood Drop */}
          <g className="drop-shadow-lg">
            {/* Left Hand Wrist & Palm Shadow */}
            <path
              d="M100 360 C110 325 130 280 155 255 C170 240 190 235 200 248 C205 255 195 275 180 295 C160 320 130 355 100 360 Z"
              fill="#3A1209"
              opacity="0.6"
            />
            {/* Left Hand Main Form */}
            <path
              d="M95 345 C115 310 140 270 168 250 C182 240 198 248 198 262 C198 282 170 325 140 350 C120 362 85 350 95 345 Z"
              fill="url(#handSkinLeft)"
              stroke="#6B2615"
              strokeWidth="1.5"
            />
            {/* Left Fingers Cupping Upwards */}
            <path
              d="M60 305 C95 275 145 235 178 222 C188 218 198 225 195 235 C186 256 142 310 112 335 C88 355 48 325 60 305 Z"
              fill="url(#handSkinLeft)"
              stroke="#6B2615"
              strokeWidth="1.5"
            />
            <path
              d="M50 285 C85 255 135 218 168 208 C176 205 184 212 181 220 C173 238 132 290 102 312 C80 330 42 302 50 285 Z"
              fill="url(#handSkinLeft)"
              stroke="#7A2D1A"
              strokeWidth="1.2"
              opacity="0.95"
            />

            {/* Right Hand Wrist & Palm Shadow */}
            <path
              d="M300 360 C290 325 270 280 245 255 C230 240 210 235 200 248 C195 255 205 275 220 295 C240 320 270 355 300 360 Z"
              fill="#3A1209"
              opacity="0.6"
            />
            {/* Right Hand Main Form */}
            <path
              d="M305 345 C285 310 260 270 232 250 C218 240 202 248 202 262 C202 282 230 325 260 350 C280 362 315 350 305 345 Z"
              fill="url(#handSkinRight)"
              stroke="#6B2615"
              strokeWidth="1.5"
            />
            {/* Right Fingers Cupping Upwards */}
            <path
              d="M340 305 C305 275 255 235 222 222 C212 218 202 225 205 235 C214 256 258 310 288 335 C312 355 352 325 340 305 Z"
              fill="url(#handSkinRight)"
              stroke="#6B2615"
              strokeWidth="1.5"
            />
            <path
              d="M350 285 C315 255 265 218 232 208 C224 205 216 212 219 220 C227 238 268 290 298 312 C320 330 358 302 350 285 Z"
              fill="url(#handSkinRight)"
              stroke="#7A2D1A"
              strokeWidth="1.2"
              opacity="0.95"
            />
          </g>

          {/* LAYER 3: Main Luminous Liquid Blood Drop resting in Hands */}
          <motion.g
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scale: [1, 1, 1.035, 1, 1],
                  }
            }
            transition={{
              duration: DURATION,
              repeat: Infinity,
              times: [0, 0.48, 0.54, 0.65, 1],
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "200px 225px" }}
          >
            {/* Main Drop Silhouette */}
            <path
              d="M200 130C200 130 148 198 148 235C148 263.719 171.281 287 200 287C228.719 287 252 263.719 252 235C252 198 200 130 200 130Z"
              fill="url(#mainBloodGrad)"
              filter="url(#dropGlow)"
            />

            {/* Inner Glossy 3D Highlight Curve */}
            <path
              d="M182 180 C175 198 170 216 167 235"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.55"
            />

            {/* Inner Soft Ambient Light Reflection */}
            <path
              d="M218 210 C225 225 228 240 226 255"
              stroke="#FF8DA1"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.3"
            />

            {/* Resting ECG Pulse Line inside Drop */}
            <path
              d={ecgPath}
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            />

            {/* LAYER 4: Step 6 — ECG Pulse Wave (Triggered immediately after merge impact) */}
            {!shouldReduceMotion && (
              <motion.path
                d={ecgPath}
                stroke="#FFFFFF"
                strokeWidth="3.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#pulseGlow)"
                initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 0, 0.45, 0.45, 0],
                  pathOffset: [0, 0, 0, 0.55, 1],
                  opacity: [0, 0, 1, 1, 0],
                }}
                transition={{
                  duration: DURATION,
                  repeat: Infinity,
                  times: [0, 0.54, 0.62, 0.80, 0.88],
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.g>

          {/* LAYER 5: Step 5 — Crimson Impact Ripple expanding from top of drop */}
          {!shouldReduceMotion && (
            <motion.ellipse
              cx="200"
              cy="145"
              rx="14"
              ry="5"
              fill="none"
              stroke="#FF4D6D"
              strokeWidth="2.5"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 0, 0.85, 0],
                scale: [0.4, 0.4, 2.5, 4.0],
              }}
              transition={{
                duration: DURATION,
                repeat: Infinity,
                times: [0, 0.48, 0.56, 0.68],
                ease: "easeOut",
              }}
              style={{ transformOrigin: "200px 145px" }}
            />
          )}

          {/* LAYER 6: Steps 1 to 4 — Falling Blood Droplet Sequence */}
          {!shouldReduceMotion && (
            <motion.g
              initial={{ y: 0, opacity: 0, scale: 0.2 }}
              animate={{
                // Step 1: DROP FORMS (y: 10 -> scale 0.2 to 0.85)
                // Step 2: DROP APPEARS (y: 20 -> scale 1.0, pause)
                // Step 3: FALL & ACCELERATE (y: 20 -> y: 95 with gravity curve)
                // Step 4: MERGE (y: 95 -> y: 105, absorption scale 0.15)
                // Steps 5-7: RESET (stay hidden until next loop)
                y: [0, 12, 12, 95, 105, 105],
                scale: [0.2, 0.85, 1.0, 1.08, 0.15, 0.15],
                scaleY: [0.5, 1.0, 1.0, 1.35, 0.3, 0.3], // natural fluid elongation during acceleration
                opacity: [0, 0.9, 1.0, 1.0, 0, 0],
              }}
              transition={{
                duration: DURATION,
                repeat: Infinity,
                times: [0, 0.10, 0.22, 0.46, 0.52, 1],
                ease: ["easeOut", "easeInOut", "easeIn", "easeOut", "linear"],
              }}
              style={{ transformOrigin: "200px 25px" }}
            >
              {/* Teardrop Vector centered at x=200, y=25 */}
              <path
                d="M200 15C200 15 191 28 191 35C191 39.9706 195.029 44 200 44C204.971 44 209 39.9706 209 35C209 28 200 15 200 15Z"
                fill="url(#dropGrad)"
                filter="url(#dropGlow)"
              />
              <path
                d="M197 28C195.5 32 194.5 35 194.5 38"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
            </motion.g>
          )}
        </svg>
      </div>
    </div>
  );
}
