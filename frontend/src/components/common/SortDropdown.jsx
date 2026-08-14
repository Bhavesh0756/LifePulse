import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function SortDropdown({
  sortBy,
  sortOrder = 'desc',
  options = [],
  onSortChange,
  className = '',
}) {
  const toggleOrder = () => {
    const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    if (onSortChange) onSortChange(sortBy, nextOrder);
  };

  const handleFieldChange = (e) => {
    if (onSortChange) onSortChange(e.target.value, sortOrder);
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-xs font-bold text-slate-600 shrink-0 flex items-center gap-1">
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        <span>Sort:</span>
      </span>

      <select
        value={sortBy}
        onChange={handleFieldChange}
        className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-brand-navy focus:outline-none focus-red-glow transition-all duration-200 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        onClick={toggleOrder}
        type="button"
        title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
        className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-brand-red hover:bg-rose-50 transition-all flex items-center justify-center"
      >
        {sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
