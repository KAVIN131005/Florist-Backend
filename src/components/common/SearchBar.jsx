// src/components/common/SearchBar.jsx
import React, { useState, useEffect } from "react";

export default function SearchBar({ initial = "", onSearch, placeholder = "Search..." , delay = 400 }) {
  const [q, setQ] = useState(initial);

  useEffect(() => {
    const t = setTimeout(() => {
      onSearch?.(q);
    }, delay);
    return () => clearTimeout(t);
  }, [q, delay, onSearch]);

  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <button onClick={() => onSearch?.(q)} className="px-3 py-2 bg-indigo-600 text-white rounded">Search</button>
    </div>
  );
}
