import React, { useEffect, useState, useContext } from "react";
import ProductCard from "./ProductCard";
import Loading from "../common/Loading";
import SearchBar from "../common/SearchBar";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import api from "../../services/api";
import { filterProducts, sortProducts } from "../../utils/helpers";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function ProductGrid({ products: propProducts = null, featured = false }) {
  const { dark } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(!propProducts);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (propProducts) {
      let data = propProducts;
      if (featured) data = data.filter(p => p.featured);
      setProducts(data);
      setFiltered(data);
      setLoading(false);
    } else {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const res = await api.get("/products");
          let data = res.data.content || [];
          if (featured) data = data.filter(p => p.featured);
          setProducts(data);
          setFiltered(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }

    // Fetch categories for filtering
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, [propProducts, featured]);

  // Enhanced filtering with better field mapping and sorting
  useEffect(() => {
    // Apply filters using helper functions
    const filters = {
      search: search.trim(),
      category,
      priceRange: priceRange[0] === 0 && priceRange[1] === 10000 ? null : priceRange
    };

    let result = filterProducts.applyAllFilters(products, filters);

    // Apply sorting
    if (sortBy && result.length > 0) {
      switch (sortBy) {
        case "name":
          result = sortProducts.byName(result, sortOrder === "asc");
          break;
        case "price":
          result = sortProducts.byPrice(result, sortOrder === "asc");
          break;
        case "category":
          result = sortProducts.byCategory(result, sortOrder === "asc");
          break;
        case "date":
          result = sortProducts.byDate(result, sortOrder === "asc");
          break;
        default:
          break;
      }
    }

    setFiltered(result);
  }, [search, category, priceRange, products, sortBy, sortOrder]);

  if (loading) return <Loading />;

  // Reset filters function
  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setPriceRange([0, 10000]);
  };

  return (
    <div className={`
      p-4 sm:p-6 md:p-8
      transition-colors duration-300
      ${dark ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-pink-50 to-white text-gray-800'}
    `}>
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[250px]">
          <SearchBar 
            placeholder="Search products by name..." 
            onSearch={setSearch} 
            initial={search}
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <CategoryFilter 
            onSelect={setCategory} 
            categories={categories}
            selectedCategory={category}
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <PriceFilter 
            onChange={setPriceRange} 
            currentRange={priceRange}
          />
        </div>
        <button
          onClick={resetFilters}
          className={`
            px-4 py-2 rounded-lg transition-all duration-300
            transform hover:scale-105 font-medium text-sm
            ${dark 
              ? 'bg-pink-800 hover:bg-pink-700 text-white' 
              : 'bg-pink-600 hover:bg-pink-500 text-white'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500
          `}
        >
          Reset Filters
        </button>
      </div>

      {/* Sort and View Options */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center flex-wrap gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label className={`
              text-sm font-medium
              ${dark ? 'text-gray-300' : 'text-gray-700'}
            `}>
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`
                rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-pink-500
                ${dark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
                }
              `}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="category">Category</option>
              <option value="date">Date Added</option>
            </select>
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg 
              transition-all duration-300
              ${dark 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700' 
                : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
              }
              focus:outline-none focus:ring-2 focus:ring-pink-500
            `}
            title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
          >
            <span className="text-sm">{sortOrder === "asc" ? "↑" : "↓"}</span>
            <span className="text-sm">{sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
          </button>
        </div>

        {/* Results count */}
        <div className={`
          text-sm px-3 py-1 rounded-full
          ${dark ? 'bg-gray-800 text-gray-300' : 'bg-pink-100 text-pink-800'}
        `}>
          Showing <span className="font-bold">{filtered.length}</span> of <span className="font-bold">{products.length}</span> products
        </div>
      </div>

      {/* Filter summary */}
      <div className="mb-6 flex flex-wrap gap-2">
        {search && (
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${dark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'}
            flex items-center
          `}>
            <span className="mr-1">🔍</span> 
            Search: "{search}"
            <button 
              onClick={() => setSearch("")}
              className={`
                ml-2 rounded-full w-5 h-5 flex items-center justify-center
                ${dark ? 'bg-blue-800 text-blue-100 hover:bg-blue-700' : 'bg-blue-200 text-blue-700 hover:bg-blue-300'}
              `}
            >
              ×
            </button>
          </span>
        )}
        {category && (
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${dark ? 'bg-green-900/50 text-green-200' : 'bg-green-100 text-green-800'}
            flex items-center
          `}>
            <span className="mr-1">📂</span>
            Category: {category}
            <button 
              onClick={() => setCategory("")}
              className={`
                ml-2 rounded-full w-5 h-5 flex items-center justify-center
                ${dark ? 'bg-green-800 text-green-100 hover:bg-green-700' : 'bg-green-200 text-green-700 hover:bg-green-300'}
              `}
            >
              ×
            </button>
          </span>
        )}
        {(priceRange[0] > 0 || priceRange[1] < 10000) && (
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${dark ? 'bg-purple-900/50 text-purple-200' : 'bg-purple-100 text-purple-800'}
            flex items-center
          `}>
            <span className="mr-1">💰</span>
            Price: ₹{priceRange[0]} - ₹{priceRange[1]}
            <button 
              onClick={() => setPriceRange([0, 10000])}
              className={`
                ml-2 rounded-full w-5 h-5 flex items-center justify-center
                ${dark ? 'bg-purple-800 text-purple-100 hover:bg-purple-700' : 'bg-purple-200 text-purple-700 hover:bg-purple-300'}
              `}
            >
              ×
            </button>
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={`
          text-center py-12 rounded-xl
          ${dark ? 'bg-gray-800/50' : 'bg-pink-50/50'}
          transition-colors duration-300
        `}>
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className={`text-lg mb-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            No products found matching your criteria.
          </p>
          <button
            onClick={resetFilters}
            className={`
              px-6 py-3 rounded-lg transition-all duration-300
              transform hover:scale-105 font-medium
              ${dark 
                ? 'bg-pink-700 hover:bg-pink-600 text-white' 
                : 'bg-pink-600 hover:bg-pink-500 text-white'
              }
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500
            `}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p, index) => (
            <div 
              key={p.id || index} 
              className="animate-fadeIn" 
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
      
      {/* Add animation keyframe */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
