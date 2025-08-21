import React, { useState } from "react";

export default function ProductSearch({ onSearch }) {
  const [value, setValue] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full px-4 py-2 border rounded-l-xl"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 rounded-r-xl hover:bg-green-700"
      >
        Search
      </button>
    </form>
  );
}
