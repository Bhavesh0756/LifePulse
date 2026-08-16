import React from 'react';
import { PlusCircle, Search, PackageCheck, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HospitalQuickActions({ isVerified = true }) {
  const actions = [
    {
      id: 'new_request',
      label: 'New Request',
      icon: PlusCircle,
      href: '/hospital/requests/new',
      disabled: !isVerified,
    },
    {
      id: 'find_donors',
      label: 'Find Donors',
      icon: Search,
      href: '/hospital/requests',
    },
    {
      id: 'check_inventory',
      label: 'Check Inventory',
      icon: PackageCheck,
      href: '#inventory',
    },
    {
      id: 'request_report',
      label: 'Request Report',
      icon: FileSpreadsheet,
      href: '#analytics',
    },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[308px] select-none overflow-hidden">
      <h3 className="text-base font-bold text-brand-navy border-b border-slate-100 pb-3 mb-2 shrink-0">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-2.5 flex-1">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.a
              key={action.id}
              href={action.disabled ? '#' : action.href}
              whileHover={action.disabled ? {} : { y: -2 }}
              whileTap={action.disabled ? {} : { scale: 0.98 }}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 border transition-all group ${
                action.disabled
                  ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                  : 'bg-rose-50/50 hover:bg-rose-100/70 border-rose-100/90 text-brand-navy shadow-2xs hover:shadow-md'
              }`}
            >
              <div className="w-8 h-8 rounded-2xl bg-white border border-rose-200/80 text-brand-red flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold leading-tight">{action.label}</span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
