import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductReviews from "./ProductReviews";
import api from "../services/api";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p className="p-6">Loading product...</p>;

  return (
    <div className="p-6 grid md:grid-cols-2 gap-8">
      <img
        src={product.imageUrl || "/images/placeholder.jpg"}
        alt={product.name}
        className="w-full h-96 object-cover rounded-lg shadow-md"
      />

      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-700 mb-2">{product.description}</p>
        <p className="text-lg font-semibold text-green-700">₹{product.price}</p>
        <p className="text-sm text-gray-500 mb-4">{product.category}</p>

        <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700">
          Add to Cart
        </button>
      </div>

      <div className="mt-6 md:col-span-2">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
