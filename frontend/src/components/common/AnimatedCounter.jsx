import React, { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ value, duration = 800, className = '' }) {
  const [displayValue, setDisplayValue] = useState('0');
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Parse numeric value and any text prefix/suffix
    const strVal = String(value || '0');
    const numericMatch = strVal.match(/[\d,.]+/);
    
    if (!numericMatch) {
      setDisplayValue(strVal);
      return;
    }

    const targetNum = parseFloat(numericMatch[0].replace(/,/g, ''));
    if (isNaN(targetNum) || targetNum === 0 || hasAnimated.current) {
      setDisplayValue(strVal);
      return;
    }

    const prefix = strVal.substring(0, numericMatch.index);
    const suffix = strVal.substring(numericMatch.index + numericMatch[0].length);
    const isDecimal = numericMatch[0].includes('.');

    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease out quad easing
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const currentNum = Math.floor(easedProgress * targetNum);

      const formattedNum = isDecimal
        ? (easedProgress * targetNum).toFixed(1)
        : currentNum.toLocaleString();

      setDisplayValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(strVal);
        hasAnimated.current = true;
      }
    }

    const animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
}
