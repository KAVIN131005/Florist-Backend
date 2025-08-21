import React from "react";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/helpers";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleRemove = (id) => removeFromCart(id);
  const handleQuantityChange = (id, quantity) => updateQuantity(id, Number(quantity));

  const total = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price ?? item._raw?.price ?? 0) || 0),
    0
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>
      {cart.length === 0 ? (
        <div className="bg-white shadow p-8 rounded-xl text-center text-gray-600">
          Your cart is empty
        </div>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50 font-semibold text-gray-700">Items</div>
          <div className="p-4 divide-y">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-lg font-semibold">Total</div>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(total)}</div>
          </div>
          <div className="px-4 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={clearCart}
              className="inline-flex justify-center bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Clear Cart
            </button>
            <Link
              to="/checkout"
              className="inline-flex justify-center bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
