import React from "react";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/helpers";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // Handle different price field names
  const productPrice = product.pricePer100g || product.price || 0;
  const productCategory = product.categoryName || product.category || 'Uncategorized';

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg p-4 transition transform hover:scale-105">
      <img
        src={product.imageUrl || "/images/placeholder.jpg"}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg mb-3"
        onError={(e) => {
          e.target.src = "/images/placeholder.jpg";
        }}
      />
      <div className="h-16 mb-2">
        <h3 className="text-lg font-semibold line-clamp-2">{product.name}</h3>
      </div>
      
      <div className="mb-2">
        <p className="text-green-600 font-bold text-lg">
          {formatCurrency(productPrice)}
        </p>
        <p className="text-sm text-gray-500 capitalize">{productCategory}</p>
      </div>

      {product.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
      )}

      {product.floristName && (
        <p className="text-xs text-gray-500 mb-3">
          By: {product.floristName}
        </p>
      )}

      <button
        onClick={() => addToCart(product)}
        className="mt-auto w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Add to Cart
      </button>
    </div>
  );
}
