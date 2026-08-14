import React from 'react';

export default function FilterSelect({
  label,
  value,
  onChange,
  options = [],
  className = '',
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs font-bold text-slate-600 shrink-0">{label}:</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-brand-navy focus:outline-none focus-red-glow transition-all duration-200 cursor-pointer"
      >
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}
