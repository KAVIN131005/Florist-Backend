import React, { useEffect, useState } from "react";

import api from "../../services/api";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);

  const fetchCart = () => {
    api.get("/api/cart", { withCredentials: true })
      .then(res => setCart(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchCart(); }, []);

  const handleRemove = (id) => {
    api.delete(`/api/cart/${id}`, { withCredentials: true })
      .then(() => fetchCart());
  };

  const handleQuantityChange = (id, quantity) => {
    api.put(`/api/cart/${id}`, { quantity }, { withCredentials: true })
      .then(() => fetchCart());
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">My Cart</h1>
      {cart.length === 0 ? <p>Your cart is empty</p> : (
        <div className="bg-white shadow p-4 rounded-xl">
          {cart.map(item => (
            <CartItem key={item.id} item={item} onRemove={handleRemove} onQuantityChange={handleQuantityChange} />
          ))}
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total:</span> <span>₹{total}</span>
          </div>
          <Link to="/checkout" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded">Checkout</Link>
        </div>
      )}
    </div>
  );
}
