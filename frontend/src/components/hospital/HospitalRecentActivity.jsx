import React from 'react';
import { Activity, ArrowRight, CheckCircle2, PlusCircle, Package, HeartPulse } from 'lucide-react';

export default function HospitalRecentActivity({ onViewAll }) {
  const defaultActivities = [
    {
      id: 1,
      title: '2 Units received',
      subtitle: 'from Rahul S.',
      time: '10 min ago',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      id: 2,
      title: 'Request accepted',
      subtitle: 'A+ Blood Request',
      time: '35 min ago',
      icon: HeartPulse,
      color: 'text-brand-red bg-rose-50 border-rose-100',
    },
    {
      id: 3,
      title: 'New request created',
      subtitle: 'O+ Blood Request',
      time: '1 hr ago',
      icon: PlusCircle,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      id: 4,
      title: 'Inventory updated',
      subtitle: 'B+ Blood',
      time: '2 hr ago',
      icon: Package,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[308px] select-none overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 shrink-0">
          <h3 className="text-base font-bold text-brand-navy">Recent Activity</h3>
          <Activity className="w-4 h-4 text-slate-400" />
        </div>

        {/* Timeline Stream - Scrollable internal list matching h-[308px] outer height */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {defaultActivities.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="flex items-start justify-between gap-2.5 relative z-10 pl-1">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${act.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-brand-navy leading-tight truncate">{act.title}</h4>
                    <span className="text-[11px] text-slate-500 font-medium truncate block">{act.subtitle}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap shrink-0">{act.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-2.5 border-t border-slate-100 mt-2 shrink-0">
        <button
          onClick={onViewAll}
          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-brand-red hover:underline"
        >
          <span>View All Activity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
