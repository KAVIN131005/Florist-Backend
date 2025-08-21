import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Loading from "../common/Loading";
import SearchBar from "../common/SearchBar";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import api from "../../services/api";
import { filterProducts, sortProducts } from "../../utils/helpers";

export default function ProductGrid({ products: propProducts = null, featured = false }) {
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
        const res = await api.get("/api/categories");
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
    <div className="p-6">
      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[250px]">
          <SearchBar 
            placeholder="Search products by name..." 
            onSearch={setSearch} 
            initial={search}
          />
        </div>
        <div className="min-w-[200px]">
          <CategoryFilter 
            onSelect={setCategory} 
            categories={categories}
            selectedCategory={category}
          />
        </div>
        <div className="min-w-[200px]">
          <PriceFilter 
            onChange={setPriceRange} 
            currentRange={priceRange}
          />
        </div>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Sort and View Options */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="category">Category</option>
              <option value="date">Date Added</option>
            </select>
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1 px-3 py-1 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
          >
            <span className="text-sm">{sortOrder === "asc" ? "↑" : "↓"}</span>
            <span className="text-sm">{sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
          </button>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Showing {filtered.length} of {products.length} products
        </div>
      </div>

      {/* Filter summary */}
      <div className="mb-4 flex flex-wrap gap-2">
        {search && (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Search: "{search}"
            <button 
              onClick={() => setSearch("")}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        )}
        {category && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Category: {category}
            <button 
              onClick={() => setCategory("")}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </span>
        )}
        {(priceRange[0] > 0 || priceRange[1] < 10000) && (
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            Price: ₹{priceRange[0]} - ₹{priceRange[1]}
            <button 
              onClick={() => setPriceRange([0, 10000])}
              className="ml-2 text-purple-600 hover:text-purple-800"
            >
              ×
            </button>
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
          <button
            onClick={resetFilters}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
