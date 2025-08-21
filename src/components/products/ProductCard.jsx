import React from "react";
import { useCart } from "../../hooks/useCart"

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg p-4 transition transform hover:scale-105">
      <img
        src={product.imageUrl || "/images/placeholder.jpg"}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">₹{product.price}</p>
      <p className="text-sm text-gray-400">{product.category}</p>

      <button
        onClick={() => addToCart(product)}
        className="mt-3 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
