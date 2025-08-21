// src/components/common/Loading.jsx
import React from "react";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="w-full flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <svg className="w-6 h-6 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span className="text-sm text-gray-600">{message}</span>
      </div>
    </div>
  );
}
