import React, { useState, useEffect } from "react";

export default function CategoryFilter({ onSelect, categories = [], selectedCategory = "" }) {
  const [value, setValue] = useState(selectedCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setValue(selectedCategory);
  }, [selectedCategory]);

  const handleChange = (selectedValue) => {
    setValue(selectedValue);
    onSelect(selectedValue);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setValue(inputValue);
    onSelect(inputValue);
    setIsDropdownOpen(inputValue.length > 0);
  };

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueCategories = Array.from(
    new Set(filteredCategories.map(cat => cat.name))
  ).map(name => ({ name }));

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search or select category"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
        className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      
      {value && (
        <button
          onClick={() => handleChange("")}
          className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      )}

      {isDropdownOpen && (uniqueCategories.length > 0 || searchTerm) && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {uniqueCategories.length > 0 ? (
            uniqueCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleChange(category.name)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {category.name}
              </button>
            ))
          ) : searchTerm ? (
            <div className="px-3 py-2 text-gray-500 text-sm">
              No categories found matching "{searchTerm}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
