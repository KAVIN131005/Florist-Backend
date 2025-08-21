import React, { useState, useEffect } from "react";

export default function PriceFilter({ onChange, currentRange = [0, 10000] }) {
  const [min, setMin] = useState(currentRange[0]);
  const [max, setMax] = useState(currentRange[1]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMin(currentRange[0]);
    setMax(currentRange[1]);
  }, [currentRange]);

  const handleApply = () => {
    const minVal = Math.max(0, Number(min) || 0);
    const maxVal = Math.max(minVal, Number(max) || 10000);
    onChange([minVal, maxVal]);
    setIsExpanded(false);
  };

  const handleReset = () => {
    setMin(0);
    setMax(10000);
    onChange([0, 10000]);
  };

  const predefinedRanges = [
    { label: "Under ₹100", range: [0, 100] },
    { label: "₹100 - ₹500", range: [100, 500] },
    { label: "₹500 - ₹1000", range: [500, 1000] },
    { label: "₹1000 - ₹2000", range: [1000, 2000] },
    { label: "Above ₹2000", range: [2000, 10000] },
  ];

  const currentRangeLabel = currentRange[0] === 0 && currentRange[1] === 10000 
    ? "All Prices" 
    : `₹${currentRange[0]} - ₹${currentRange[1]}`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="border px-3 py-2 rounded-lg w-full text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {currentRangeLabel}
        <span className="float-right">
          {isExpanded ? "▲" : "▼"}
        </span>
      </button>

      {isExpanded && (
        <div className="absolute z-10 w-80 mt-1 bg-white border rounded-lg shadow-lg p-4">
          {/* Quick select options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select
            </label>
            <div className="grid grid-cols-1 gap-2">
              {predefinedRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => onChange(range.range)}
                  className="text-left px-3 py-2 text-sm rounded hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom range */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Range
            </label>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  className="border px-2 py-1 w-full rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  min="0"
                />
              </div>
              <span className="text-gray-500 mt-5">to</span>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="10000"
                  className="border px-2 py-1 w-full rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleApply}
                className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Apply
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
