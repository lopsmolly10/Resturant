import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search dishes, orders, customers...',
  onClear,
  className = ''
}) {
  return (
    <div className={`search-bar-wrapper ${className}`}>
      <Search className="search-icon-pos" size={18} />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={() => {
            if (onClear) onClear();
            else onChange?.('');
          }}
          title="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

