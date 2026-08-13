import React from 'react';
import Card from '../Card';
import { Badge } from '../Badge';
import { HeartPulse, Award, ShieldCheck, MapPin, Calendar } from 'lucide-react';

export default function DonorStatsCards({ profile, user }) {
  const totalDonations = profile?.totalDonationsCount || 0;
  const livesSaved = profile?.livesSavedCount || totalDonations * 3;
  const eligibility = profile?.eligibilityStatus || 'ELIGIBLE';
  const radius = profile?.preferredRadiusKm || 25;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Donations */}
      <Card variant="default" className="p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Donations</span>
          <div className="w-9 h-9 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-brand-navy">{totalDonations}</span>
          <span className="text-xs text-brand-slate font-medium">units donated</span>
        </div>
      </Card>

      {/* Lives Saved */}
      <Card variant="default" className="p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Lives Saved</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-brand-navy">~{livesSaved}</span>
          <span className="text-xs text-emerald-700 font-bold">patients helped</span>
        </div>
      </Card>

      {/* Eligibility Status */}
      <Card variant="default" className="p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Eligibility Status</span>
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div>
          <Badge variant={eligibility === 'ELIGIBLE' ? 'success' : 'warning'} className="mb-1">
            {eligibility === 'ELIGIBLE' ? 'READY TO DONATE' : 'TEMPORARILY DEFERRED'}
          </Badge>
          <span className="block text-[11px] text-slate-500 font-medium">Verified medical clearance</span>
        </div>
      </Card>

      {/* Preferred Distance Radius */}
      <Card variant="default" className="p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Match Radius</span>
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-brand-navy">{radius}</span>
          <span className="text-xs text-brand-slate font-medium">km coverage area</span>
        </div>
      </Card>
    </div>
  );
}
