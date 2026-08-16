import React from 'react';
import RadarPing from '../common/RadarPing';
import { Badge } from '../Badge';
import { AlertCircle, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CriticalRequestsPanel({ requests = [], onViewAll }) {
  const defaultRequests = [
    {
      id: 'req_1',
      bloodGroup: 'A+',
      unitsNeeded: 2,
      department: 'Trauma Care Unit',
      refCode: 'Ref: PT-STAGE6-001',
      location: 'Mumbai, Maharashtra',
      dueDate: 'Due: 25/08/2026',
      urgency: 'CRITICAL',
    },
    {
      id: 'req_2',
      bloodGroup: 'B+',
      unitsNeeded: 1,
      department: 'Emergency Ward',
      refCode: 'Ref: PT-STAGE6-002',
      location: 'Mumbai, Maharashtra',
      dueDate: 'Due: 26/08/2026',
      urgency: 'URGENT',
    },
  ];

  const criticalList = requests.length > 0
    ? requests.filter((r) => r.urgency === 'CRITICAL' || r.urgency === 'EMERGENCY' || r.urgency === 'URGENT')
    : defaultRequests;

  const getLocationText = (locationProp, locationAddress) => {
    if (typeof locationProp === 'string') return locationProp;
    if (locationProp && typeof locationProp === 'object') {
      const city = locationProp.city || '';
      const state = locationProp.state || '';
      if (city || state) return `${city}${state ? `, ${state}` : ''}`;
    }
    if (typeof locationAddress === 'string') return locationAddress;
    return 'Mumbai, Maharashtra';
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[308px] select-none overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-brand-red" />
            <h3 className="text-base font-bold text-brand-navy">Critical Requests</h3>
          </div>
          <button onClick={onViewAll} className="text-xs font-bold text-brand-red hover:underline">
            View All
          </button>
        </div>

        {/* Requests List */}
        <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
          {criticalList.slice(0, 2).map((req) => {
            const isCritical = req.urgency === 'CRITICAL' || req.urgency === 'EMERGENCY';
            const locationStr = getLocationText(req.location, req.locationAddress);

            return (
              <motion.div
                key={req.id || req._id}
                whileHover={{ y: -1 }}
                onClick={onViewAll}
                className={`p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                  isCritical
                    ? 'bg-rose-50/40 border-rose-200/90 shadow-xs'
                    : 'bg-amber-50/30 border-amber-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-brand-navy">
                        {req.bloodGroup} Blood Request
                      </h4>
                      <Badge
                        variant={isCritical ? 'danger' : 'warning'}
                        className="text-[9px] font-extrabold uppercase py-0.5"
                      >
                        {req.urgency || 'CRITICAL'}
                      </Badge>
                    </div>

                    <p className="text-xs font-bold text-slate-600">
                      {req.unitsNeeded || req.unitsRequired || 1} Units Needed • {req.department || req.unitDepartment || 'Trauma Care Unit'}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-medium pt-0.5">
                      <span>{req.refCode || `Ref: PT-${String(req.id || req._id).substring(0, 6)}`}</span>
                      <span>•</span>
                      <span>{locationStr}</span>
                      {req.dueDate && (
                        <>
                          <span>•</span>
                          <span className="text-rose-600 font-bold">{req.dueDate}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Pulsing Radar Pulse Icon Badge */}
                  <div className="shrink-0 flex items-center justify-center">
                    {isCritical ? (
                      <RadarPing color="#E11D48" size={32} duration={2.5}>
                        <div className="w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center shadow-md">
                          <Flame className="w-3.5 h-3.5" />
                        </div>
                      </RadarPing>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
