import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Activity, Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-200 text-xs space-y-1.5 font-sans z-50">
        <p className="font-extrabold text-brand-navy border-b border-slate-100 pb-1 flex items-center justify-between gap-4">
          <span>Blood Group: <span className="text-brand-red font-black">{label}</span></span>
          <span className="text-[10px] bg-rose-50 text-brand-red px-1.5 py-0.5 rounded font-black">
            {data.fulfillmentRate}% Fulfilled
          </span>
        </p>
        <div className="space-y-1 text-slate-600 font-medium">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-red inline-block" />
              Units Requested:
            </span>
            <span className="font-bold text-brand-navy">{data.unitsRequested}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              Units Fulfilled:
            </span>
            <span className="font-bold text-emerald-600">{data.unitsFulfilled}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100 text-[11px]">
            <span>Total Requests:</span>
            <span className="font-bold text-brand-navy">{data.totalRequests}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function BloodGroupDemandChart({ data = [] }) {
  const chartData = Array.isArray(data) ? data : [];
  const hasData = chartData.some((d) => d.unitsRequested > 0 || d.totalRequests > 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 hover-red-glow-subtle transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-brand-navy flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-red" />
            <span>Blood Group Demand & Fulfillment</span>
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Requested vs Fulfilled units across all 8 blood groups
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <Info className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs font-semibold">No blood group demand recorded for selected filters.</p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="bloodGroup"
                tick={{ fill: '#1E293B', fontSize: 11, fontWeight: 700 }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#64748B', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingBottom: '10px' }}
              />
              <Bar dataKey="unitsRequested" name="Units Requested" fill="#E11D48" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="unitsFulfilled" name="Units Fulfilled" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
