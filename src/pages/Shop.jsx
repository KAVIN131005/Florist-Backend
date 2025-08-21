import React, { useEffect, useState } from "react";
import ProductGrid from "../components/products/ProductGrid";
import api from "../services/api";
import Loading from "../components/common/Loading";

export default function Shop() {
  const [products, setProducts] = useState([]);
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Shop All Products</h2>
      {loading ? <Loading /> : <ProductGrid products={products} />}
    </div>
  );
}
