import React, { useState } from "react";

export default function PriceFilter({ onChange }) {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(10000);

  const handleApply = () => {
    onChange([Number(min), Number(max)]);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder="Min"
        className="border px-2 py-1 w-20 rounded-lg"
        value={min}
        onChange={(e) => setMin(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max"
        className="border px-2 py-1 w-20 rounded-lg"
        value={max}
        onChange={(e) => setMax(e.target.value)}
      />
      <button
        onClick={handleApply}
        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
      >
        Apply
      </button>
    </div>
  );
}
