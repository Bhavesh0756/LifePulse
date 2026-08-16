import React from 'react';
import AnimatedCounter from '../common/AnimatedCounter';
import { HeartPulse, Award, ShieldCheck, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function DonorStatsCards({ profile, historyCount = 0 }) {
  const shouldReduceMotion = useReducedMotion();

  const totalDonations = profile?.totalDonationsCount !== undefined ? profile.totalDonationsCount : (historyCount || 1);
  const livesSaved = profile?.livesSavedCount || totalDonations * 3;
  const eligibility = profile?.eligibilityStatus || 'ELIGIBLE';
  const radius = profile?.preferredRadiusKm || 25;

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.1,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. TOTAL DONATIONS */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Total Donations
          </span>
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100/80 text-brand-red flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
            <HeartPulse className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-black text-brand-navy tracking-tight">
            <AnimatedCounter value={totalDonations} />
          </div>
          <span className="text-xs text-slate-500 font-extrabold mt-0.5 block">
            Units Donated
          </span>
        </div>
      </motion.div>

      {/* 2. LIVES SAVED */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Lives Saved
          </span>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100/80 text-emerald-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-black text-brand-navy tracking-tight flex items-baseline">
            <span className="mr-0.5">~</span>
            <AnimatedCounter value={livesSaved} />
          </div>
          <span className="text-xs text-emerald-600 font-extrabold mt-0.5 block">
            Patients Helped
          </span>
        </div>
      </motion.div>

      {/* 3. ELIGIBILITY STATUS */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Eligibility Status
          </span>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-black tracking-wider uppercase rounded-full mb-1">
            {eligibility === 'ELIGIBLE' ? 'READY TO DONATE' : 'TEMPORARILY DEFERRED'}
          </span>
          <span className="text-xs text-slate-500 font-medium block">
            Verified medical clearance
          </span>
        </div>
      </motion.div>

      {/* 4. MATCH RADIUS */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Match Radius
          </span>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100/80 text-purple-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-black text-brand-navy tracking-tight">
            <AnimatedCounter value={radius} />
          </div>
          <span className="text-xs text-slate-500 font-extrabold mt-0.5 block">
            km Coverage Area
          </span>
        </div>
      </motion.div>
    </div>
  );
}
