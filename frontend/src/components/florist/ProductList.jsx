import React from "react";

export default function ProductList({ products }) {
  if (!products.length) return <p>No products found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <div key={p.id} className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-bold">{p.name}</h3>
          <p>{p.category}</p>
          <p>₹{p.price}</p>
          <p>{p.quantity}g</p>
        </div>
      ))}
    </div>
  );
}
