import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-200 text-xs space-y-1.5 font-sans z-50">
        <p className="font-extrabold text-brand-navy border-b border-slate-100 pb-1">
          Date: <span className="text-brand-red font-mono">{label}</span>
        </p>
        <div className="space-y-1 text-slate-600 font-medium">
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-brand-navy">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function RequestTrendsChart({ data = [], range = '30d', onRangeChange }) {
  const chartData = Array.isArray(data) ? data : [];
  const hasData = chartData.length > 0;

  const rangeButtons = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: 'All Time', value: 'all' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 hover-red-glow-subtle transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-brand-navy flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-red" />
            <span>Blood Request Activity Trends</span>
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Time-series analysis of created, fulfilled, and critical blood requests
          </p>
        </div>

        {/* Date Range Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl text-[11px] font-extrabold">
          {rangeButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => onRangeChange && onRangeChange(btn.value)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                range === btn.value
                  ? 'bg-white text-brand-red shadow-sm'
                  : 'text-slate-500 hover:text-brand-navy'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <Info className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs font-semibold">No request trend data recorded for selected period.</p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFulfilled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748B', fontSize: 10 }}
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
              <Area
                type="monotone"
                dataKey="created"
                name="Requests Created"
                stroke="#E11D48"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCreated)"
              />
              <Area
                type="monotone"
                dataKey="fulfilled"
                name="Requests Fulfilled"
                stroke="#059669"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFulfilled)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
