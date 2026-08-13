import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginationControls({
  pagination = {},
  onPageChange,
  className = '',
}) {
  const { page = 1, totalPages = 1, total = 0, hasNext = false, hasPrevious = false } = pagination;

  if (total === 0 || totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 text-xs ${className}`}>
      {/* Items Counter */}
      <span className="font-bold text-slate-500 text-center sm:text-left">
        Page <span className="text-brand-navy font-black">{page}</span> of{' '}
        <span className="text-brand-navy font-black">{totalPages}</span> ({total} items total)
      </span>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange && onPageChange(page - 1)}
          disabled={!hasPrevious}
          className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1 transition-all ${
            hasPrevious
              ? 'bg-white border-slate-200 text-brand-navy hover:text-brand-red hover:border-brand-red shadow-sm'
              : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 font-extrabold text-brand-red">
          {page}
        </span>

        <button
          onClick={() => onPageChange && onPageChange(page + 1)}
          disabled={!hasNext}
          className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1 transition-all ${
            hasNext
              ? 'bg-white border-slate-200 text-brand-navy hover:text-brand-red hover:border-brand-red shadow-sm'
              : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
