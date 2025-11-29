import React, { useState, useEffect, useContext } from "react";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/helpers";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [promo, setPromo] = useState("");
  const applied = promo.trim().toUpperCase() === "7FOREVER"; // coupon 7Forever (case-insensitive)
  const { dark } = useContext(ThemeContext);
  
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
      <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto text-center">
        <div className={`${dark ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-xl'} rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-300 transform hover:shadow-2xl`}>
          <div className="text-6xl md:text-7xl mb-4 md:mb-6 animate-bounce">🛒</div>
          <h1 className={`text-2xl sm:text-3xl font-bold mb-3 md:mb-4 ${dark ? 'text-white' : 'text-gray-800'} font-serif`}>Your Cart is Empty</h1>
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} mb-6 md:mb-8 max-w-md mx-auto`}>Looks like you haven't added any flowers to your cart yet. Explore our beautiful collection!</p>
          <Link 
            to="/shop" 
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 inline-flex items-center gap-2"
          >
            Start Shopping <span className="text-xl">🌸</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${dark ? 'text-white' : 'text-gray-800'} font-serif relative
          after:content-[''] after:absolute after:w-16 after:h-1 
          after:bg-pink-400 after:bottom-[-8px] after:left-0
          after:rounded-full`}
        >
          My Cart
        </h1>
        <button
          onClick={() => { clearCart(); try { localStorage.removeItem("couponCode"); } catch { /* ignore */ } }}
          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-300 inline-flex items-center gap-1 hover:gap-2"
        >
          <span>Clear Cart</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-xl rounded-3xl overflow-hidden border`}>
        <div className="p-4 sm:p-6 md:p-8">
          {cart.map(item => (
            <div key={item.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 ${dark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-pink-50'} border-b last:border-b-0 transition-all duration-300`}>
              <div className="relative group">
                <div className={`w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-xl shadow-lg ${dark ? 'border-2 border-gray-600 bg-gray-700' : 'border border-pink-100 bg-white'} transition-all duration-300 flex items-center justify-center`}>
                  <img
                    src={item.imageUrl || "/images/placeholder.jpg"}
                    alt={item.name}
                    className="max-w-full max-h-full object-scale-down p-1"
                    style={{ maxWidth: '90%', maxHeight: '90%' }}
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                      e.target.onerror = null; // Prevent infinite loops
                      e.target.src = "/images/placeholder.jpg";
                    }}
                  />
                </div>
                <div className={`absolute inset-0 ${dark ? 'bg-pink-600' : 'bg-pink-600'} bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-300`}></div>
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-800'} text-lg md:text-xl`}>{item.name}</h3>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} capitalize`}>
                  {item.categoryName || item.category || 'Uncategorized'}
                </p>
                <p className={`${dark ? 'text-green-400' : 'text-green-600'} font-bold mt-1`}>
                  {formatCurrency(item.pricePer100g || item.price || 0)}
                </p>
              </div>
              
              <div className="flex items-center gap-2 my-2 sm:my-0">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className={`w-8 h-8 rounded-full ${dark ? 'bg-gray-700 hover:bg-pink-800' : 'bg-gray-200 hover:bg-pink-200'} flex items-center justify-center transition-colors shadow-sm hover:shadow transform hover:scale-110`}
                  aria-label="Decrease quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${dark ? 'text-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className={`w-10 text-center font-medium ${dark ? 'text-white' : ''}`}>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className={`w-8 h-8 rounded-full ${dark ? 'bg-gray-700 hover:bg-pink-800' : 'bg-gray-200 hover:bg-pink-200'} flex items-center justify-center transition-colors shadow-sm hover:shadow transform hover:scale-110`}
                  aria-label="Increase quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${dark ? 'text-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <p className={`font-bold ${dark ? 'text-white' : 'text-gray-800'} text-lg`}>
                  {formatCurrency((item.pricePer100g || item.price || 0) * item.quantity)}
                </p>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm mt-1 transition-all duration-300 hover:underline flex items-center gap-1"
                >
                  <span>Remove</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`${dark ? 'bg-gradient-to-b from-gray-700 to-gray-800 border-gray-700' : 'bg-gradient-to-b from-gray-50 to-white border-gray-100'} p-4 sm:p-6 md:p-8 border-t`}>
          {/* Promo Code */}
          {!applied ? (
            <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="flex-1 w-full">
                <label className={`block text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Promo Code</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={promo}
                    onChange={e => setPromo(e.target.value)}
                    className={`w-full ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'} border px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm`}
                  />
                  {promo && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className={`text-xs ${dark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-600'} px-3 py-1 rounded-full font-medium`}>
                        No discount
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={`mb-6 flex items-center justify-between ${dark ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} border rounded-xl px-4 py-3 shadow-inner animate-pulse`}>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${dark ? 'text-green-400' : 'text-green-600'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className={`text-sm font-medium ${dark ? 'text-green-300' : 'text-green-700'}`}>Coupon <span className="font-bold">7Forever</span> applied – ₹20 off</div>
              </div>
            </div>
          )}
          
          <div className={`space-y-3 text-sm mb-6 p-4 ${dark ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-inner`}>
            <div className="flex justify-between items-center">
              <span className={`${dark ? 'text-gray-300' : 'text-gray-600'}`}>Subtotal</span>
              <span className={`font-medium ${dark ? 'text-white' : ''}`}>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`${dark ? 'text-gray-300' : 'text-gray-600'}`}>Discount</span>
              <span className={`${applied ? (dark ? "text-green-400 font-medium" : "text-green-600 font-medium") : (dark ? "text-gray-400" : "text-gray-500")}`}>
                - {formatCurrency(discount)}
              </span>
            </div>
            <div className={`flex justify-between items-center font-semibold ${dark ? 'border-gray-600' : 'border-gray-200'} border-t pt-3 text-lg`}>
              <span className={dark ? 'text-white' : ''}>Total</span>
              <span className={dark ? 'text-green-400' : 'text-green-600'}>{formatCurrency(total)}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/shop" 
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-center py-3 px-4 rounded-full font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px] flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Continue Shopping</span>
            </Link>
            <Link 
              to="/checkout" 
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-center py-3 px-4 rounded-full font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px] flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
