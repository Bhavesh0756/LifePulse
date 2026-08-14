import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function AnimatedCheckmark({ color = '#10B981', size = 64 }) {
  const pathRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    anime({
      targets: pathRef.current,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 800,
      direction: 'normal',
      loop: false
    });
  }, []);

  return (
    <svg width={size} height={size} viewBox="0 0 52 52" className="block">
      <circle cx="26" cy="26" r="25" fill="none" stroke={color} strokeWidth="2" opacity="0.2" />
      <path
        ref={pathRef}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 27l7 7 16-16"
      />
    </svg>
  );
}
