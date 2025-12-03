import React, { useEffect, useState } from "react";
import ProductGrid from "../components/products/ProductGrid";
import Loading from "../components/common/Loading";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(null); // null = unknown yet
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Create a request without authentication for public products endpoint
        const res = await fetch("http://localhost:8081/api/products?size=1000", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Products response:", data); // Debug log
        
        // Handle both paginated (Page) and direct array responses
        const productData = data.content || data || [];
        setProducts(Array.isArray(productData) ? productData : []);
      } catch (err) {
        if (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED')) {
          console.log('Products API unavailable - running in demo mode');
        } else {
          console.error("Error fetching products:", err);
        }
        setProducts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Load category visibility using public endpoint
  useEffect(() => {
    let cancelled = false;
    
    // Use public categories endpoint instead of admin endpoint
    fetch("http://localhost:8081/api/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(cats => {
        if (cancelled) return;
        // Expect each category to maybe have a visible flag; fallback to true if missing
        const map = {};
        cats.forEach(c => { map[c.name] = c.visible !== false; });
        setVisibleCategories(map);
      })
      .catch((err) => {
        if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED'))) {
          console.log('Categories API unavailable - running in demo mode');
        }
        // Fallback: local map if categories not accessible
        try {
          const localMap = JSON.parse(localStorage.getItem("localCategoryVisibility") || "{}");
          setVisibleCategories(localMap);
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
