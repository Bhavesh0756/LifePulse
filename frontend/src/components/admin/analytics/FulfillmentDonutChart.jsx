import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon, Info } from 'lucide-react';

const COLORS = {
  OPEN: '#2563EB', // Blue
  PARTIALLY_FULFILLED: '#F59E0B', // Amber
  FULFILLED: '#059669', // Emerald
  CANCELLED: '#F43F5E', // Rose
};

const LABELS = {
  OPEN: 'Open Requests',
  PARTIALLY_FULFILLED: 'Partially Fulfilled',
  FULFILLED: 'Fulfilled Requests',
  CANCELLED: 'Cancelled Requests',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-2.5 rounded-xl shadow-xl border border-slate-200 text-xs font-sans space-y-1">
        <p className="font-extrabold text-brand-navy flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: data.fill }} />
          <span>{LABELS[data.name] || data.name}</span>
        </p>
        <p className="text-slate-600 font-bold">Count: {data.value}</p>
      </div>
    );
  }
  return null;
};

export default function FulfillmentDonutChart({ statusCounts = {} }) {
  const counts = statusCounts || {};
  const chartData = Object.entries(counts)
    .map(([key, value]) => ({ name: key, value }))
    .filter((d) => d.value > 0);

  const hasData = chartData.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 hover-red-glow-subtle transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-brand-navy flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-brand-red" />
            <span>Request Lifecycle Distribution</span>
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Proportion of requests across status lifecycles
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <Info className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs font-semibold">No requests found matching criteria.</p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94A3B8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                formatter={(value) => (
                  <span className="text-xs font-bold text-slate-700">{LABELS[value] || value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
