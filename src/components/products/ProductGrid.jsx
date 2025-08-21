import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Loading from "../common/Loading";
import SearchBar from "../common/SearchBar";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter"; // ✅ import price filter
import api from "../../services/api";

export default function ProductGrid({ products: propProducts = null, featured = false }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]); // ✅ price range
  const [loading, setLoading] = useState(!propProducts); // only load if no prop

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
  }, [propProducts, featured]);

  // Filter products by search, category, and price
  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      result = result.filter(p =>
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (priceRange) {
      result = result.filter(
        p => p.price >= priceRange[0] && p.price <= priceRange[1]
      );
    }

    setFiltered(result);
  }, [search, category, priceRange, products]);

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <SearchBar placeholder="Search products..." onSearch={setSearch} />
        <CategoryFilter onSelect={setCategory} />
        <PriceFilter onChange={setPriceRange} /> {/* ✅ add price filter */}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
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
