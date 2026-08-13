import React from 'react';
import { Building2, Info, ArrowUpRight } from 'lucide-react';
import { Badge } from '../../Badge';

export default function HospitalActivityTable({ hospitals = [] }) {
  const list = Array.isArray(hospitals) ? hospitals : [];
  const hasData = list.length > 0;

  const getRateBadge = (rate) => {
    if (rate >= 75) return <Badge variant="success">{rate}%</Badge>;
    if (rate >= 40) return <Badge variant="warning">{rate}%</Badge>;
    return <Badge variant="neutral">{rate}%</Badge>;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 hover-red-glow-subtle transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-brand-navy flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-red" />
            <span>Healthcare Institution Activity & Performance</span>
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Top active hospitals ranked by request volumes and fulfillment performance
          </p>
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
                <th className="py-3 px-4 text-center">Total Requests</th>
                <th className="py-3 px-4 text-center">Units Requested</th>
                <th className="py-3 px-4 text-center">Units Fulfilled</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Fulfillment Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {list.map((h, idx) => (
                <tr key={h.hospitalId || idx} className="hover:bg-rose-50/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-brand-navy flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{h.hospitalName || 'Verified Healthcare Institution'}</span>
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
  );
}
