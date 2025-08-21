// src/components/common/SearchBar.jsx
import React, { useState, useEffect } from "react";

export default function SearchBar({ initial = "", onSearch, placeholder = "Search..." , delay = 400 }) {
  const [q, setQ] = useState(initial);

  useEffect(() => {
    setQ(initial);
  }, [initial]);

  useEffect(() => {
    const t = setTimeout(() => {
      onSearch?.(q);
    }, delay);
    return () => clearTimeout(t);
  }, [q, delay, onSearch]);

  const handleClear = () => {
    setQ("");
    onSearch?.("");
  };

  return (
    <div className="relative w-full">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
        {q && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            type="button"
          >
            ×
          </button>
        )}
        <button 
          onClick={() => onSearch?.(q)} 
          className="px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          type="button"
        >
          🔍
        </button>
      </div>
    </div>
  );
}
