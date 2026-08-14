import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function AnimeTextReveal({ text, className = '' }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;
    
    anime.timeline({ loop: false })
      .add({
        targets: textRef.current.querySelectorAll('.letter'),
        translateY: [50, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1200,
        delay: (el, i) => 300 + 40 * i
      });
  }, []);

  return (
    <span ref={textRef} className={`inline-block ${className}`}>
      {text.split('').map((char, index) => (
        char === ' ' ? (
          <span key={index} className="letter inline-block opacity-0">&nbsp;</span>
        ) : (
          <span key={index} className="letter inline-block opacity-0 transform origin-bottom">{char}</span>
        )
      ))}
    </span>
  );
}
