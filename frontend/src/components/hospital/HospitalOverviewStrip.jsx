import React from 'react';
import AnimatedCounter from '../common/AnimatedCounter';
import { HeartPulse, Droplet, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function HospitalOverviewStrip({ requests = [] }) {
  const shouldReduceMotion = useReducedMotion();

  // Calculate stats strictly from real data
  const activeRequests = requests.filter((r) => r.status === 'OPEN' || r.status === 'PARTIALLY_FULFILLED').length;
  
  const urgentRequests = requests.filter(
    (r) => (r.urgency === 'CRITICAL' || r.urgency === 'URGENT') && 
           (r.status === 'OPEN' || r.status === 'PARTIALLY_FULFILLED')
  ).length;

  // Use Math.max with 0 to prevent NaN if there are no requests, avoiding fake data fallback
  const totalUnitsNeeded = requests.reduce((sum, r) => {
    if (r.status === 'OPEN' || r.status === 'PARTIALLY_FULFILLED') {
      return sum + (Number(r.unitsRequired) || 0);
    }
    return sum;
  }, 0);
  
  const totalUnitsFulfilled = requests.reduce((sum, r) => sum + (Number(r.unitsFulfilled) || 0), 0);

  const cards = [
    {
      id: 'active_requests',
      label: 'ACTIVE REQUESTS',
      value: activeRequests,
      subtext: 'open & partially fulfilled',
      icon: HeartPulse,
      iconBg: 'bg-blue-50 border-blue-100 text-blue-600',
    },
    {
      id: 'urgent_requests',
      label: 'URGENT REQUESTS',
      value: urgentRequests,
      subtext: 'need immediate attention',
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 border-rose-100 text-brand-red',
    },
    {
      id: 'units_needed',
      label: 'UNITS NEEDED',
      value: totalUnitsNeeded,
      subtext: 'total units currently needed',
      icon: Droplet,
      iconBg: 'bg-rose-50 border-rose-100 text-brand-red',
    },
    {
      id: 'units_fulfilled',
      label: 'UNITS FULFILLED',
      value: totalUnitsFulfilled,
      subtext: 'units received total',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.05,
        duration: 0.3,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[116px] select-none"
          >
            {/* Top Row: Title Left, Icon Right */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 truncate">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-xs shrink-0 ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Bottom Section: Number & Subtitle */}
            <div className="mt-2">
              <div className="text-3xl font-black text-brand-navy tracking-tight leading-none flex items-baseline">
                <AnimatedCounter value={card.value} />
                {card.unit && <span className="text-sm font-bold text-slate-500 ml-1">{card.unit}</span>}
              </div>
              <span className="text-xs text-slate-500 font-bold block mt-1.5 truncate">
                {card.subtext}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
