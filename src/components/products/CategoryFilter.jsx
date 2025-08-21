import React, { useState } from "react";

export default function CategoryFilter({ onSelect }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    onSelect(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search by Category"
      value={value}
      onChange={handleChange}
      className="border px-3 py-2 rounded-lg w-full"
    />
  );
}
