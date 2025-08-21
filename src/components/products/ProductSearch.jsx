import React, { useState } from "react";

export default function ProductSearch({ onSearch, placeholder = "Search products...", showAdvanced = false }) {
  const [value, setValue] = useState("");
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    florist: ""
  });

  const handleSimpleSearch = (e) => {
    e.preventDefault();
    onSearch({ type: 'simple', query: value });
  };

  const handleAdvancedSearch = (e) => {
    e.preventDefault();
    onSearch({ type: 'advanced', criteria: searchCriteria });
  };

  const handleCriteriaChange = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearSearch = () => {
    setValue("");
    setSearchCriteria({
      name: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      florist: ""
    });
    onSearch({ type: 'clear' });
  };

  if (isAdvanced && showAdvanced) {
    return (
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Advanced Search</h3>
          <button
            onClick={() => setIsAdvanced(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to Simple Search
          </button>
        </div>

        <form onSubmit={handleAdvancedSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchCriteria.name}
                onChange={(e) => handleCriteriaChange('name', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="Enter category"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchCriteria.category}
                onChange={(e) => handleCriteriaChange('category', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price (₹)
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchCriteria.minPrice}
                onChange={(e) => handleCriteriaChange('minPrice', e.target.value)}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price (₹)
              </label>
              <input
                type="number"
                placeholder="10000"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchCriteria.maxPrice}
                onChange={(e) => handleCriteriaChange('maxPrice', e.target.value)}
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Florist Name
              </label>
              <input
                type="text"
                placeholder="Enter florist name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchCriteria.florist}
                onChange={(e) => handleCriteriaChange('florist', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearSearch}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSimpleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={placeholder}
            className="w-full px-4 py-2 border rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-r-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Search
        </button>
        {showAdvanced && (
          <button
            type="button"
            onClick={() => setIsAdvanced(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Advanced
          </button>
        )}
      </form>
    </div>
  );
}
