// src/components/common/Pagination.jsx
import React from "react";

export default function Pagination({ page = 0, size = 12, total = 0, onPage }) {
  const totalPages = Math.max(1, Math.ceil(total / size));
  const pages = [];
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages - 1, page + 2);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center gap-2 justify-center mt-6">
      <button
        onClick={() => onPage(Math.max(0, page - 1))}
        disabled={page <= 0}
        className="px-3 py-1 border rounded disabled:opacity-60"
      >
        Prev
      </button>

      {start > 0 && <span className="px-2">...</span>}
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`px-3 py-1 border rounded ${p === page ? "bg-indigo-600 text-white" : "bg-white"}`}
        >
          {p + 1}
        </button>
      ))}
      {end < totalPages - 1 && <span className="px-2">...</span>}

      <button
        onClick={() => onPage(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
        className="px-3 py-1 border rounded disabled:opacity-60"
      >
        Next
      </button>
    </div>
  );
}
