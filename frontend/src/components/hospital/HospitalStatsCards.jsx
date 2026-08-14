import React, { useEffect, useRef } from 'react';
import Card from '../Card';
import { Activity, FileText, HeartPulse, CheckCircle2 } from 'lucide-react';
import anime from 'animejs';

export default function HospitalStatsCards({ stats }) {
  const activeRequests = stats?.activeRequests || 0;
  const totalRequests = stats?.totalRequests || 0;
  const unitsRequested = stats?.unitsRequested || 0;
  const unitsFulfilled = stats?.unitsFulfilled || 0;

  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const iconRefs = useRef([]);
  const numberRefs = useRef([]);
  
  // Track previous values for updating animations
  const prevValues = useRef({
    activeRequests: 0,
    totalRequests: 0,
    unitsRequested: 0,
    unitsFulfilled: 0,
  });

  // Handle Entrance Animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Safety check for unmounted refs
    const validCards = cardRefs.current.filter(Boolean);
    const validIcons = iconRefs.current.filter(Boolean);
    
    if (prefersReducedMotion) {
      anime.set(validCards, { opacity: 1, translateY: 0, scale: 1 });
      anime.set(validIcons, { opacity: 1, scale: 1 });
      
      const targetValues = [activeRequests, totalRequests, unitsRequested, unitsFulfilled];
      targetValues.forEach((val, i) => {
        if (numberRefs.current[i]) numberRefs.current[i].textContent = val;
      });
      prevValues.current = { activeRequests, totalRequests, unitsRequested, unitsFulfilled };
      return;
    }

    // Set initial states to avoid flash
    anime.set(validCards, { opacity: 0, translateY: 24, scale: 0.97 });
    anime.set(validIcons, { opacity: 0, scale: 0.75 });

    const tl = anime.timeline({
      easing: 'easeOutCubic',
    });

    tl.add({
      targets: validCards,
      opacity: [0, 1],
      translateY: [24, 0],
      scale: [0.97, 1],
      duration: 650,
      delay: anime.stagger(100),
    })
    .add({
      targets: validIcons,
      opacity: [0, 1],
      scale: [0.75, 1],
      duration: 500,
      delay: anime.stagger(100),
      easing: 'easeOutBack',
    }, '-=500');

    return () => {
      anime.remove(validCards);
      anime.remove(validIcons);
    };
  }, []); // Only run once on mount

  // Handle Number Animation Updates
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const targetValues = [activeRequests, totalRequests, unitsRequested, unitsFulfilled];
    const prevArray = [
      prevValues.current.activeRequests,
      prevValues.current.totalRequests,
      prevValues.current.unitsRequested,
      prevValues.current.unitsFulfilled
    ];

    if (prefersReducedMotion) {
      targetValues.forEach((val, i) => {
        if (numberRefs.current[i]) numberRefs.current[i].textContent = val;
      });
      prevValues.current = { activeRequests, totalRequests, unitsRequested, unitsFulfilled };
      return;
    }

    targetValues.forEach((val, i) => {
      const prev = prevArray[i];
      if (val !== prev && numberRefs.current[i]) {
        // Animate from prev to new value
        const obj = { value: prev };
        const diff = Math.abs(val - prev);
        const duration = Math.max(900, Math.min(1200, diff * 50));
        
        anime({
          targets: obj,
          value: val,
          duration: duration,
          round: 1, // Ensure integer updates
          easing: 'easeOutQuart',
          update: function() {
            if (numberRefs.current[i]) {
              numberRefs.current[i].textContent = obj.value;
            }
          }
        });
      } else if (val === 0 && prev === 0 && numberRefs.current[i]) {
        numberRefs.current[i].textContent = "0";
      }
    });

    prevValues.current = { activeRequests, totalRequests, unitsRequested, unitsFulfilled };

    return () => {
      targetValues.forEach((_, i) => {
        if (numberRefs.current[i]) anime.remove(numberRefs.current[i]);
      });
    };
  }, [activeRequests, totalRequests, unitsRequested, unitsFulfilled]);

  // Handle Hover Interaction
  const handleHover = (index, isEntering) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const card = cardRefs.current[index];
    const icon = iconRefs.current[index];
    
    if (card) {
      anime({
        targets: card,
        translateY: isEntering ? -2 : 0,
        duration: 250,
        easing: 'easeOutSine'
      });
    }
    
    if (icon) {
      anime({
        targets: icon,
        scale: isEntering ? 1.04 : 1,
        duration: 250,
        easing: 'easeOutSine'
      });
    }
  };

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Active Requests */}
      <div 
        ref={(el) => (cardRefs.current[0] = el)}
        onMouseEnter={() => handleHover(0, true)}
        onMouseLeave={() => handleHover(0, false)}
      >
        <Card variant="default" className="p-5 border border-slate-200 transition-shadow hover:shadow-md cursor-default h-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Requests</span>
            <div 
              ref={(el) => (iconRefs.current[0] = el)}
              className="w-9 h-9 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center"
            >
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span ref={(el) => (numberRefs.current[0] = el)} className="text-3xl font-black text-brand-navy">0</span>
            <span className="text-xs text-brand-red font-bold">open & urgent</span>
          </div>
        </Card>
      </div>

      {/* Total Requests */}
      <div 
        ref={(el) => (cardRefs.current[1] = el)}
        onMouseEnter={() => handleHover(1, true)}
        onMouseLeave={() => handleHover(1, false)}
      >
        <Card variant="default" className="p-5 border border-slate-200 transition-shadow hover:shadow-md cursor-default h-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Requests</span>
            <div 
              ref={(el) => (iconRefs.current[1] = el)}
              className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"
            >
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span ref={(el) => (numberRefs.current[1] = el)} className="text-3xl font-black text-brand-navy">0</span>
            <span className="text-xs text-slate-500 font-medium">all-time requests</span>
          </div>
        </Card>
      </div>

      {/* Units Requested */}
      <div 
        ref={(el) => (cardRefs.current[2] = el)}
        onMouseEnter={() => handleHover(2, true)}
        onMouseLeave={() => handleHover(2, false)}
      >
        <Card variant="default" className="p-5 border border-slate-200 transition-shadow hover:shadow-md cursor-default h-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Units Requested</span>
            <div 
              ref={(el) => (iconRefs.current[2] = el)}
              className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center"
            >
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span ref={(el) => (numberRefs.current[2] = el)} className="text-3xl font-black text-brand-navy">0</span>
            <span className="text-xs text-slate-500 font-medium">total blood units</span>
          </div>
        </Card>
      </div>

      {/* Units Fulfilled */}
      <div 
        ref={(el) => (cardRefs.current[3] = el)}
        onMouseEnter={() => handleHover(3, true)}
        onMouseLeave={() => handleHover(3, false)}
      >
        <Card variant="default" className="p-5 border border-slate-200 transition-shadow hover:shadow-md cursor-default h-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Units Fulfilled</span>
            <div 
              ref={(el) => (iconRefs.current[3] = el)}
              className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center"
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span ref={(el) => (numberRefs.current[3] = el)} className="text-3xl font-black text-brand-navy">0</span>
            <span className="text-xs text-emerald-600 font-bold">units received</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
