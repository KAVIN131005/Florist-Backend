import React from "react";

export default function CartItem({ item, onRemove, onQuantityChange }) {
  return (
    <div className="flex items-center justify-between border-b py-3">
      <div>
        <h3 className="font-semibold">{item.product.name}</h3>
        <p>{item.quantity} x ₹{item.product.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={item.quantity}
          min="1"
          onChange={(e) => onQuantityChange(item.id, e.target.value)}
          className="w-16 border rounded p-1"
        />
        <button onClick={() => onRemove(item.id)} className="text-red-600">Remove</button>
      </div>
    </div>
  );
}
