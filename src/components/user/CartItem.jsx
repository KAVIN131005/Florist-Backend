import React from "react";
import { formatCurrency } from "../../utils/helpers";

export default function CartItem({ item, onRemove, onQuantityChange }) {
  const name = item.name || item.product?.name || "Unnamed";
  const price = item.price ?? item.product?.price ?? 0;
  const img = item.imageUrl || item.product?.imageUrl || "/images/placeholder.jpg";
  const subtotal = (Number(item.quantity) || 0) * (Number(price) || 0);

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <img
        src={img}
        onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
        alt={name}
        className="w-20 h-20 object-cover rounded-md shadow"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{name}</h3>
        <div className="text-sm text-gray-600">
          <span className="mr-2">Price:</span>
          <span className="font-medium">{formatCurrency(price)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Decrease quantity"
          className="px-2 py-1 border rounded hover:bg-gray-50"
          onClick={() => onQuantityChange(item.id, Math.max(0, Number(item.quantity) - 1))}
        >
          −
        </button>
        <input
          type="number"
          value={item.quantity}
          min="1"
          onChange={(e) => onQuantityChange(item.id, e.target.value)}
          className="w-16 border rounded p-1 text-center"
        />
        <button
          type="button"
          aria-label="Increase quantity"
          className="px-2 py-1 border rounded hover:bg-gray-50"
          onClick={() => onQuantityChange(item.id, Number(item.quantity) + 1)}
        >
          +
        </button>
      </div>

      <div className="w-24 text-right">
        <div className="text-sm text-gray-500">Subtotal</div>
        <div className="font-semibold">{formatCurrency(subtotal)}</div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="ml-2 text-red-600 hover:text-red-700"
      >
        Remove
      </button>
    </div>
  );
}
