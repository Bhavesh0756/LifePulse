import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function AnimeParticles({ count = 30, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const elements = container.querySelectorAll('.anime-particle');

    elements.forEach(el => {
      anime({
        targets: el,
        translateX: () => anime.random(-250, 250),
        translateY: () => anime.random(-250, 250),
        scale: () => anime.random(0.5, 2),
        opacity: () => anime.random(0.1, 0.6),
        easing: 'easeInOutQuad',
        duration: () => anime.random(3000, 8000),
        direction: 'alternate',
        loop: true,
      });
    });
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="anime-particle absolute w-1.5 h-1.5 rounded-full bg-brand-red left-1/2 top-1/2" 
        />
      ))}
    </div>
  );
}
