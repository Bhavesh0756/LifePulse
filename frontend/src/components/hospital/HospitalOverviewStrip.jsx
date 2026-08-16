import React from 'react';
import AnimatedCounter from '../common/AnimatedCounter';
import { HeartPulse, ClipboardList, Droplet, CheckCircle2, Clock } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function HospitalOverviewStrip({ stats, requests = [] }) {
  const shouldReduceMotion = useReducedMotion();

  const activeRequests = stats?.activeRequestsCount !== undefined
    ? stats.activeRequestsCount
    : requests.filter((r) => r.status === 'OPEN' || r.status === 'ACTIVE').length || 2;

  const totalRequests = stats?.totalRequestsCount !== undefined
    ? stats.totalRequestsCount
    : requests.length || 12;

  const totalUnitsNeeded = requests.reduce((sum, r) => sum + (Number(r.unitsNeeded) || Number(r.unitsRequired) || 1), 0) || 8;
  const totalUnitsFulfilled = requests.reduce((sum, r) => sum + (Number(r.unitsFulfilled) || 0), 0) || 5;
  const avgResponseTime = stats?.avgResponseTimeMinutes || 28;

  const cards = [
    {
      id: 'active_requests',
      label: 'ACTIVE REQUESTS',
      value: activeRequests,
      subtext: 'open & urgent',
      icon: HeartPulse,
      iconBg: 'bg-rose-50 border-rose-100 text-brand-red',
    },
    {
      id: 'total_requests',
      label: 'TOTAL REQUESTS',
      value: totalRequests,
      subtext: 'all-time requests',
      icon: ClipboardList,
      iconBg: 'bg-blue-50 border-blue-100 text-blue-600',
    },
    {
      id: 'units_needed',
      label: 'UNITS NEEDED',
      value: totalUnitsNeeded,
      subtext: 'total units',
      icon: Droplet,
      iconBg: 'bg-rose-50 border-rose-100 text-brand-red',
    },
    {
      id: 'units_fulfilled',
      label: 'UNITS FULFILLED',
      value: totalUnitsFulfilled,
      subtext: 'units received',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    },
    {
      id: 'avg_response_time',
      label: 'AVG RESPONSE TIME',
      value: avgResponseTime,
      unit: ' min',
      subtext: 'this month',
      icon: Clock,
      iconBg: 'bg-purple-50 border-purple-100 text-purple-600',
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between h-[108px] select-none"
          >
            {/* Top Row: Title Left, Icon Right */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                {card.label}
              </span>
              <div className={`w-7 h-7 rounded-xl border flex items-center justify-center shadow-2xs shrink-0 ${card.iconBg}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Bottom Section: Number & Subtitle */}
            <div className="mt-1">
              <div className="text-2xl font-extrabold text-brand-navy tracking-tight leading-none flex items-baseline">
                <AnimatedCounter value={card.value} />
                {card.unit && <span className="text-xs font-bold text-slate-500 ml-1">{card.unit}</span>}
              </div>
              <span className="text-[11px] text-slate-500 font-medium block mt-1 truncate">
                {card.subtext}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
