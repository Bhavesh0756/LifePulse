import React from 'react';
import Card from '../Card';
import { Activity, FileText, HeartPulse, CheckCircle2 } from 'lucide-react';

export default function HospitalStatsCards({ stats }) {
  const activeRequests = stats?.activeRequests || 0;
  const totalRequests = stats?.totalRequests || 0;
  const unitsRequested = stats?.unitsRequested || 0;
  const unitsFulfilled = stats?.unitsFulfilled || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Active Requests */}
      <Card variant="default" className="p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Requests</span>
          <div className="w-9 h-9 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-brand-navy">{activeRequests}</span>
          <span className="text-xs text-brand-red font-bold">open & urgent</span>
        </div>
      </Card>

      {/* Total Requests */}
      <Card variant="default" className="p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Requests</span>
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-brand-navy">{totalRequests}</span>
          <span className="text-xs text-slate-500 font-medium">all-time requests</span>
        </div>
      </Card>

      {/* Units Requested */}
      <Card variant="default" className="p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Units Requested</span>
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-brand-navy">{unitsRequested}</span>
          <span className="text-xs text-slate-500 font-medium">total blood units</span>
        </div>
      </Card>

      {/* Units Fulfilled */}
      <Card variant="default" className="p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Units Fulfilled</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-brand-navy">{unitsFulfilled}</span>
          <span className="text-xs text-emerald-600 font-bold">units received</span>
        </div>
      </Card>
    </div>
  );
}
