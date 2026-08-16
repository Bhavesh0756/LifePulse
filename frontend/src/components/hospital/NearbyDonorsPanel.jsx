import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NearbyDonorsPanel({ donors = [], onViewAll }) {
  const defaultDonors = [
    { id: 1, name: 'Rahul S.', bloodGroup: 'A+', distanceKm: 1.2, status: 'AVAILABLE' },
    { id: 2, name: 'Priya M.', bloodGroup: 'A+', distanceKm: 2.5, status: 'AVAILABLE' },
    { id: 3, name: 'Arjun K.', bloodGroup: 'A+', distanceKm: 3.1, status: 'AVAILABLE' },
    { id: 4, name: 'Sneha P.', bloodGroup: 'A+', distanceKm: 4.1, status: 'ON_THE_WAY' },
    { id: 5, name: 'Vikram T.', bloodGroup: 'A+', distanceKm: 4.6, status: 'AVAILABLE' },
  ];

  const list = donors.length > 0 ? donors : defaultDonors;

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-[460px] select-none">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 shrink-0">
          <h3 className="text-base font-bold text-brand-navy">Nearby Donors</h3>
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-brand-red hover:underline"
          >
            View All
          </button>
        </div>

        {/* Vertically Scrollable Donor List */}
        <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
          {list.map((donor) => {
            const isAvailable = donor.status === 'AVAILABLE';

            return (
              <motion.div
                key={donor.id}
                whileHover={{ x: 2 }}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-rose-50/50 transition-colors border border-slate-100/60 hover:border-rose-100 cursor-pointer group"
                onClick={onViewAll}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar Circle */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-navy to-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border border-white">
                    {donor.name.charAt(0)}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-brand-navy group-hover:text-brand-red transition-colors leading-tight">
                      {donor.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                      {donor.bloodGroup} • {donor.distanceKm} km
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      <span className={`text-[10px] font-bold ${isAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {isAvailable ? 'Available' : 'On The Way'}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-red transition-colors shrink-0" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-3 border-t border-slate-100 mt-3 shrink-0">
        <button
          onClick={onViewAll}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-brand-red text-xs font-bold transition-all border border-rose-100"
        >
          <span>View All Donors</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
