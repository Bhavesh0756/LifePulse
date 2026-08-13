import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({
  value = '',
  onChange,
  placeholder = 'Search...',
  debounceMs = 350,
  className = '',
}) {
  const [searchTerm, setSearchTerm] = useState(value);
  const onChangeRef = React.useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync internal state with external value changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Debounced callback
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== value && onChangeRef.current) {
        onChangeRef.current(searchTerm);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [searchTerm, value, debounceMs]);

  const handleClear = () => {
    setSearchTerm('');
    if (onChange) onChange('');
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-9 py-2 text-xs font-bold text-brand-navy placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus-red-glow transition-all duration-200"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          type="button"
          aria-label="Clear search"
          className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
