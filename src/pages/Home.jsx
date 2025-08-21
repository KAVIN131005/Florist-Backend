import React, { useEffect, useState } from "react";
import ProductGrid from "../components/products/ProductGrid";
import api from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.content || []); // assuming backend returns { content: [...] }
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
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Florist Shop 🌸</h1>
        <p className="text-gray-600">
          Browse all flowers added by our verified florists. Add them to your cart and proceed to checkout.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">All Products</h2>
        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : (
          <ProductGrid products={products} /> /* Pass products from Home */
        )}
      </section>
    </div>
  );
}
