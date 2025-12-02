import React, { useState, useEffect, useContext } from "react";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/helpers";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [promo, setPromo] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);
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
      <div className={`min-h-screen py-12 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'}`}>
        <div className="max-w-2xl mx-auto">
          <div className={`${dark ? 'bg-gray-800 shadow-2xl border border-gray-700' : 'bg-white shadow-2xl border border-gray-100'} rounded-3xl p-8 md:p-12 text-center transition-all duration-300 transform hover:scale-105`}>
            {/* Animated Shopping Cart Icon */}
            <div className="relative mb-8">
              <div className="text-8xl md:text-9xl animate-bounce filter drop-shadow-lg">🛒</div>
              <div className="absolute top-0 right-0 w-6 h-6 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
            
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-800'} font-serif tracking-wide`}>
              Your Cart is Empty
            </h1>
            
            <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} mb-8 text-lg max-w-md mx-auto leading-relaxed`}>
              Discover our beautiful collection of fresh flowers and create your perfect arrangement
            </p>
            
            <div className="space-y-4 mb-8">
              <div className={`flex items-center gap-3 p-3 rounded-lg ${dark ? 'bg-gray-700' : 'bg-pink-50'}`}>
                <span className="text-2xl">🌸</span>
                <span className={`${dark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Fresh flowers delivered daily</span>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${dark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                <span className="text-2xl">🚚</span>
                <span className={`${dark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Free delivery on orders over ₹500</span>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${dark ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                <span className="text-2xl">💝</span>
                <span className={`${dark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Perfect for any special occasion</span>
              </div>
            </div>
            
            <Link 
              to="/shop" 
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white text-lg
                ${dark 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                } 
                transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1`}
            >
              <span className="text-2xl">🌺</span>
              Start Shopping
              <svg className="w-6 h-6 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'}`}>
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="text-5xl">🛒</div>
              <div className={`absolute -top-2 -right-2 w-8 h-8 ${dark ? 'bg-pink-600' : 'bg-pink-500'} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                {cart.length}
              </div>
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif`}>
                Shopping Cart
              </h1>
              <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          
          <button
            onClick={() => { 
              clearCart(); 
              try { localStorage.removeItem("couponCode"); } catch { /* ignore */ } 
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
              ${dark 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
              } shadow-md hover:shadow-lg transform hover:scale-105`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Cart
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden`}>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cart.map((item, index) => (
                  <div key={item.id} className={`p-6 transition-all duration-300 ${dark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} group`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-32 h-32 rounded-2xl overflow-hidden shadow-lg ${dark ? 'bg-gray-700 border-2 border-gray-600' : 'bg-gray-50 border border-gray-200'} group-hover:shadow-xl transition-all duration-300`}>
                          <img
                            src={item.imageUrl || "/images/placeholder.jpg"}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/placeholder.jpg";
                            }}
                          />
                        </div>
                        {/* Product Badge */}
                        <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold ${dark ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-600'}`}>
                          #{index + 1}
                        </div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-1 truncate`}>
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                {item.categoryName || item.category || 'Uncategorized'}
                              </span>
                            </div>
                            <p className={`text-2xl font-bold ${dark ? 'text-green-400' : 'text-green-600'} flex items-center gap-2`}>
                              {formatCurrency(item.pricePer100g || item.price || 0)}
                              <span className={`text-sm font-normal ${dark ? 'text-gray-400' : 'text-gray-500'}`}>per unit</span>
                            </p>
                          </div>
                          
                          <button
                            onClick={() => handleRemove(item.id)}
                            className={`p-2 rounded-lg transition-all duration-300 ${dark ? 'hover:bg-red-600 text-gray-400 hover:text-white' : 'hover:bg-red-50 text-gray-400 hover:text-red-600'} group/remove`}
                            aria-label="Remove item"
                          >
                            <svg className="w-5 h-5 group-hover/remove:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Quantity:</span>
                            <div className={`flex items-center border rounded-xl overflow-hidden ${dark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} shadow-md`}>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className={`px-4 py-2 font-bold transition-colors ${dark ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className={`px-6 py-2 font-bold text-lg min-w-[60px] text-center ${dark ? 'text-white bg-gray-800' : 'text-gray-900 bg-gray-50'}`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className={`px-4 py-2 font-bold transition-colors ${dark ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {/* Item Total */}
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                              {formatCurrency((item.pricePer100g || item.price || 0) * item.quantity)}
                            </p>
                            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {item.quantity} × {formatCurrency(item.pricePer100g || item.price || 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden`}>
              <div className={`p-6 border-b ${dark ? 'border-gray-700 bg-gradient-to-r from-gray-700 to-gray-800' : 'border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                <h2 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <span>📋</span>
                  Order Summary
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Promo Code Section */}
                {!applied ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowPromoInput(!showPromoInput)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 border-dashed transition-all duration-300
                        ${showPromoInput 
                          ? (dark ? 'border-pink-600 bg-pink-900/20' : 'border-pink-400 bg-pink-50') 
                          : (dark ? 'border-gray-600 bg-gray-700/50 hover:border-pink-600' : 'border-gray-300 bg-gray-50 hover:border-pink-400')
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎫</span>
                        <span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {showPromoInput ? 'Hide Promo Code' : 'Have a promo code?'}
                        </span>
                      </div>
                      <svg className={`w-5 h-5 transition-transform ${showPromoInput ? 'rotate-180' : ''} ${dark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showPromoInput && (
                      <div className="space-y-3 animate-fade-in">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Enter promo code (try: 7FOREVER)"
                            value={promo}
                            onChange={e => setPromo(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                              ${dark 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:bg-gray-600' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:bg-pink-50'
                              } focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
                          />
                          {promo && !applied && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <span className={`text-xs px-2 py-1 rounded-full ${dark ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'}`}>
                                Invalid
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={`text-xs p-3 rounded-lg ${dark ? 'bg-blue-900/30 text-blue-300 border border-blue-700' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                          💡 <strong>Tip:</strong> Use code "7FOREVER" to get ₹20 off your order
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`p-4 rounded-xl border-2 ${dark ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-300'} animate-pulse`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <p className={`font-bold ${dark ? 'text-green-300' : 'text-green-700'}`}>Promo Applied!</p>
                          <p className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>Code: <strong>7FOREVER</strong></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${dark ? 'text-green-300' : 'text-green-700'}`}>-₹20</p>
                        <p className={`text-xs ${dark ? 'text-green-400' : 'text-green-600'}`}>Discount</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setPromo('');
                        setShowPromoInput(false);
                      }}
                      className={`mt-3 text-sm ${dark ? 'text-green-400 hover:text-green-300' : 'text-green-700 hover:text-green-600'} underline`}
                    >
                      Remove promo code
                    </button>
                  </div>
                )}
                
                {/* Order Breakdown */}
                <div className={`space-y-3 pt-4 border-t ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`${dark ? 'text-gray-300' : 'text-gray-600'} flex items-center gap-2`}>
                      <span>🛍️</span>
                      Subtotal ({cart.length} items)
                    </span>
                    <span className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {applied && (
                    <div className="flex justify-between items-center">
                      <span className={`${dark ? 'text-green-400' : 'text-green-600'} flex items-center gap-2`}>
                        <span>🎫</span>
                        Promo Discount
                      </span>
                      <span className={`font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className={`${dark ? 'text-gray-300' : 'text-gray-600'} flex items-center gap-2`}>
                      <span>🚚</span>
                      Shipping
                    </span>
                    <span className={`font-bold ${total >= 500 ? (dark ? 'text-green-400' : 'text-green-600') : (dark ? 'text-white' : 'text-gray-900')}`}>
                      {total >= 500 ? 'FREE' : formatCurrency(50)}
                    </span>
                  </div>
                  
                  {total < 500 && (
                    <div className={`text-xs p-2 rounded-lg ${dark ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                      💰 Add {formatCurrency(500 - total)} more for FREE shipping!
                    </div>
                  )}
                </div>
                
                {/* Total */}
                <div className={`pt-4 border-t-2 ${dark ? 'border-gray-600' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                      <span>💰</span>
                      Total
                    </span>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${dark ? 'text-pink-400' : 'text-pink-600'}`}>
                        {formatCurrency(total + (total >= 500 ? 0 : 50))}
                      </span>
                      {applied && (
                        <p className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>
                          You saved ₹20!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-4">
              <Link 
                to="/shop" 
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                  ${dark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Continue Shopping</span>
              </Link>
              
              {isAuthenticated() ? (
                <Link 
                  to="/checkout" 
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1
                    ${dark 
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700' 
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                    }`}
                >
                  <span>🛒</span>
                  <span>Proceed to Checkout</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1
                    ${dark 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                    }`}
                >
                  <span>🔐</span>
                  <span>Login to Checkout</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Link>
              )}
            </div>
            
            {/* Trust Badges */}
            <div className={`p-4 rounded-xl ${dark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">🔒</span>
                  <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">🌸</span>
                  <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Fresh Guarantee</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">🚚</span>
                  <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">💝</span>
                  <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Gift Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
