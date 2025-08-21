import React, { useEffect, useState } from "react";
import ProductGrid from "../components/products/ProductGrid";
import api from "../services/api";
import Loading from "../components/common/Loading";
import adminService from "../services/adminService";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(null); // null = unknown yet
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        setProducts(res.data.content); // ✅ Use .content from Page object
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Load category visibility (admin endpoint) with fallback to local storage map
  useEffect(() => {
    let cancelled = false;
    adminService.getCategories()
      .then(cats => {
        if (cancelled) return;
        // Expect each category to maybe have a visible flag; fallback to true if missing
        const map = {};
        cats.forEach(c => { map[c.name] = c.visible !== false; });
        setVisibleCategories(map);
      })
      .catch(() => {
        // Fallback: local map if admin not accessible
        try {
          const localMap = JSON.parse(localStorage.getItem("localCategoryVisibility") || "{}");
          // local map keyed by id; can't reliably map name here, so we just ignore filtering if we lack names
          setVisibleCategories(localMap); // may be id keyed; filter later tries both
        } catch {
          setVisibleCategories({});
        }
      });
    return () => { cancelled = true; };
  }, []);

  const filteredProducts = React.useMemo(() => {
    if (!visibleCategories) return products; // categories not loaded yet
    // Accept product.category referencing category name; fallback keep if unknown
    return products.filter(p => {
      const hasKey = Object.prototype.hasOwnProperty.call(visibleCategories, p.category);
      const catKeyByName = hasKey ? visibleCategories[p.category] : undefined;
      if (catKeyByName !== undefined) return !!catKeyByName;
      return true; // unknown -> show
    });
  }, [products, visibleCategories]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Shop All Products</h2>
  {loading ? <Loading /> : <ProductGrid products={filteredProducts} />}
    </div>
  );
}
