import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';
import { Button } from '../Button';
import { motion } from 'framer-motion';

export default function EmptyState({
  title = 'No records found',
  message = 'There are no items matching your criteria at this time.',
  onClearFilters,
  icon: Icon = SearchX,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`py-12 px-4 text-center rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 antialiased ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-brand-red flex items-center justify-center mx-auto shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-extrabold text-brand-navy">{title}</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">{message}</p>
      </div>

      {onClearFilters && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            icon={RefreshCw}
            className="text-slate-600 border-slate-300 hover:text-brand-red hover:border-brand-red"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </motion.div>
  );
}
