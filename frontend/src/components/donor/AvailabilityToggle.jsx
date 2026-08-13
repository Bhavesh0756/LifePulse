import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, EyeOff } from 'lucide-react';

export default function AvailabilityToggle({ isAvailable, onToggle, isUpdating }) {
  return (
    <div className="flex items-center gap-3 p-2 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2">
        {isAvailable ? (
          <div className="relative flex items-center justify-center w-2.5 h-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </div>
        ) : (
          <span className="inline-flex rounded-full h-2 w-2 bg-amber-500" />
        )}

        <div className="text-left">
          <span className="block text-[11px] font-bold tracking-wider uppercase text-brand-navy">
            {isAvailable ? 'Available for Requests' : 'Standby Mode'}
          </span>
          <span className="block text-[10px] text-brand-slate">
            {isAvailable ? 'Hospitals can match you' : 'Notifications paused'}
          </span>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        type="button"
        disabled={isUpdating}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 ${
          isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
        } ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}
        role="switch"
        aria-checked={isAvailable}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isAvailable ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
