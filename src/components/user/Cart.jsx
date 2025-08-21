import React, { useState, useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/helpers";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [promo, setPromo] = useState("");
  const applied = promo.trim().toUpperCase() === "7FOREVER"; // coupon 7Forever (case-insensitive)
  
  // Persist applied coupon so Checkout can apply discount
  useEffect(() => {
    if (applied) {
      try { localStorage.setItem("couponCode", "7FOREVER"); } catch { /* ignore quota */ }
    } else {
      try { localStorage.removeItem("couponCode"); } catch { /* ignore */ }
    }
  }, [applied]);

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, quantity);
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.pricePer100g || item.price || 0;
    return sum + item.quantity * price;
  }, 0);
  const discount = applied ? 20 : 0;
  const total = Math.max(0, subtotal - discount);

  if (cart.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any flowers to your cart yet.</p>
          <Link 
            to="/shop" 
            className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Start Shopping 🌸
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Cart</h1>
        <button
          onClick={() => { clearCart(); try { localStorage.removeItem("couponCode"); } catch { /* ignore */ } }}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Clear Cart
        </button>
      </div>
      
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="p-6">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
              <img
                src={item.imageUrl || "/images/placeholder.jpg"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500 capitalize">
                  {item.categoryName || item.category || 'Uncategorized'}
                </p>
                <p className="text-green-600 font-bold">
                  {formatCurrency(item.pricePer100g || item.price || 0)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-gray-800">
                  {formatCurrency((item.pricePer100g || item.price || 0) * item.quantity)}
                </p>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-6 border-t">
          {/* Promo Code */}
          {!applied ? (
            <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                <input
                  type="text"
                  placeholder="Enter coupon"
                  value={promo}
                  onChange={e => setPromo(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              {promo && (
                <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-medium">No discount</span>
              )}
            </div>
          ) : (
            <div className="mb-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <div className="text-sm font-medium text-green-700">Coupon 7Forever applied – ₹20 off</div>
            </div>
          )}
          <div className="space-y-1 text-sm mb-4">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Discount</span><span className={applied?"text-green-600":"text-gray-500"}>- {formatCurrency(discount)}</span></div>
            <div className="flex justify-between font-semibold border-t pt-2 text-base"><span>Total</span><span className="text-green-600">{formatCurrency(total)}</span></div>
          </div>
          
          <div className="flex gap-4">
            <Link 
              to="/shop" 
              className="flex-1 bg-gray-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link 
              to="/checkout" 
              className="flex-1 bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
