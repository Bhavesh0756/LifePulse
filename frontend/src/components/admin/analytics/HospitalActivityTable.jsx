import React, { useState, useEffect } from 'react';
import { Building2, Info, Maximize2, X } from 'lucide-react';
import { Badge } from '../../Badge';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function HospitalActivityTable({ hospitals = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const list = Array.isArray(hospitals) ? hospitals : [];
  const hasData = list.length > 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const getRateBadge = (rate) => {
    if (rate >= 75) return <Badge variant="success">{rate}%</Badge>;
    if (rate >= 40) return <Badge variant="warning">{rate}%</Badge>;
    return <Badge variant="neutral">{rate}%</Badge>;
  };

  return (
    <>
      {/* Compact Normal State Card */}
      <div
        onClick={() => setIsExpanded(true)}
        className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-300 space-y-4 cursor-pointer group relative"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-brand-navy flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-red" />
              <span>Healthcare Institution Activity & Performance</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Top active hospitals ranked by request volumes and fulfillment performance
            </p>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-400 group-hover:text-brand-red group-hover:bg-rose-50 transition-colors">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>

        {!hasData ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Info className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No hospital activity recorded for selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                  <th className="py-3 px-4 rounded-l-xl">Hospital Name</th>
                  <th className="py-3 px-4 text-center">Requests</th>
                  <th className="py-3 px-4 text-center">Units Requested</th>
                  <th className="py-3 px-4 text-center">Fulfilled</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {list.map((h, idx) => (
                  <tr key={h.hospitalId || idx} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-brand-navy flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="truncate max-w-[140px] sm:max-w-xs">{h.hospitalName || 'Verified Institution'}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-extrabold text-brand-navy">
                      {h.totalRequests}
                    </td>
                    <td className="py-3 px-4 text-center font-extrabold text-brand-red">
                      {h.unitsRequested}
                    </td>
                    <td className="py-3 px-4 text-center font-extrabold text-emerald-600">
                      {h.unitsFulfilled}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      {getRateBadge(h.fulfillmentRate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expanded Focus Mode Modal Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <div
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-5xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
            >
              {/* Focus Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h2 className="text-lg font-black text-brand-navy flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-brand-red" />
                    <span>Healthcare Institution Activity & Performance</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Top active hospitals ranked by request volumes and fulfillment performance
                  </p>
                </div>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-bold"
                  title="Close Focus View (Esc)"
                >
                  <span>Close</span>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Expanded Table Content */}
              <div className="overflow-y-auto flex-1 pr-1">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50">
                      <th className="py-3.5 px-4 rounded-l-xl w-16">Rank</th>
                      <th className="py-3.5 px-4">Hospital Name</th>
                      <th className="py-3.5 px-4 text-center">Total Requests</th>
                      <th className="py-3.5 px-4 text-center">Units Requested</th>
                      <th className="py-3.5 px-4 text-center">Units Fulfilled</th>
                      <th className="py-3.5 px-4 text-right rounded-r-xl">Fulfillment Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    {list.map((h, idx) => (
                      <tr key={h.hospitalId || idx} className="hover:bg-rose-50/40 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold">
                          <span className="w-7 h-7 rounded-xl bg-rose-50 text-brand-red border border-rose-100 flex items-center justify-center font-extrabold">
                            #{idx + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-extrabold text-brand-navy text-sm">
                          {h.hospitalName || 'Verified Healthcare Institution'}
                        </td>
                        <td className="py-4 px-4 text-center font-black text-brand-navy text-sm">
                          {h.totalRequests}
                        </td>
                        <td className="py-4 px-4 text-center font-black text-brand-red text-sm">
                          {h.unitsRequested}
                        </td>
                        <td className="py-4 px-4 text-center font-black text-emerald-600 text-sm">
                          {h.unitsFulfilled}
                        </td>
                        <td className="py-4 px-4 text-right font-bold">
                          {getRateBadge(h.fulfillmentRate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
