import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function MyProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products/mine", {
        params: {
          page: 0,
          size: 12, // match your backend defaults
        },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Error fetching products:", err.response || err);
        console.error("Error response data:", err.response?.data);
        console.error("Error status:", err.response?.status);
        console.error("Error message:", err.message);
      });
  }, [setProducts]);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Products</h2>
        <Link
          to="/florist/products/add"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          + Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div
            key={p.id}
            className="relative p-4 bg-white shadow rounded-xl hover:shadow-lg transition"
          >
            {/* Featured Badge */}
            {p.featured && (
              <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded">
                FEATURED
              </span>
            )}

            {/* Product Image */}
            <div className="w-full h-48 mb-3 overflow-hidden rounded-xl border flex justify-center items-center bg-gray-100">
              <img
                src={p.imageUrl || "https://via.placeholder.com/150?text=No+Image"}
                alt={p.name}
                className="object-contain w-full h-full"
                onError={(e) => e.target.src = "https://via.placeholder.com/150?text=No+Image"}
              />
            </div>

            <h3 className="font-bold text-lg truncate">{p.name}</h3>
            <p className="text-sm text-gray-600 truncate">{p.category}</p>

            <div className="mt-2 flex justify-between items-center">
              <span className="font-semibold text-green-700">₹{p.pricePer100g}</span>
              <span className="text-sm text-gray-500">{p.stockGrams}g</span>
            </div>

            <Link
              to={`/florist/products/edit/${p.id}`}
              className="mt-3 inline-block text-blue-500 hover:underline"
            >
              Edit
            </Link>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-gray-500 col-span-full text-center mt-4">
            You have no products yet. Click "Add Product" to start selling!
          </p>
        )}
      </div>
    </div>
  );
}
