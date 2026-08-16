import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';

export default function BloodInventorySnapshot({ inventory = null }) {
  const defaultBreakdown = [
    { group: 'A+', count: 8, color: '#E11D48' },
    { group: 'B+', count: 6, color: '#F97316' },
    { group: 'O+', count: 5, color: '#10B981' },
    { group: 'AB+', count: 3, color: '#06B6D4' },
    { group: 'Others', count: 4, color: '#64748B' },
  ];

  const breakdown = inventory?.breakdown || defaultBreakdown;
  const totalUnits = inventory?.totalUnits || breakdown.reduce((sum, b) => sum + b.count, 0);
  const isLowStock = totalUnits < 30;

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[308px] select-none overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2 shrink-0">
        <h3 className="text-base font-bold text-brand-navy">Blood Inventory Snapshot</h3>
        <Package className="w-4 h-4 text-slate-400" />
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-4 py-1">
        {/* SVG Donut Ring Visual */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="4"
            />
            {/* Segment 1: A+ (30%) */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 15.13 11.0"
              fill="none"
              stroke="#E11D48"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Segment 2: B+ (23%) */}
            <path
              d="M33.13 13.08 a 15.9155 15.9155 0 0 1 -7.0 18.0"
              fill="none"
              stroke="#F97316"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Segment 3: O+ (19%) */}
            <path
              d="M26.13 31.08 a 15.9155 15.9155 0 0 1 -18.0 0.5"
              fill="none"
              stroke="#10B981"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Segment 4: AB+ (12%) */}
            <path
              d="M8.13 31.58 a 15.9155 15.9155 0 0 1 -5.5 -15.0"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Units</span>
            <span className="text-xl font-extrabold text-brand-navy">{totalUnits}</span>
          </div>
        </div>

        {/* Color Legend List */}
        <div className="space-y-1.5 w-full sm:w-auto">
          {breakdown.map((item) => (
            <div key={item.group} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-bold text-slate-600">{item.group}</span>
              </div>
              <span className="font-extrabold text-brand-navy">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning indicator if inventory is low */}
      {isLowStock && (
        <div className="mt-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Optimal supply buffer below target</span>
          </div>
          <span className="text-amber-700 underline cursor-pointer">Refill</span>
        </div>
      )}
    </div>
  );
}
