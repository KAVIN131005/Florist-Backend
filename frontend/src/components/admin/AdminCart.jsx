import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/themeContextDefinition';
import api from '../../services/api';

export default function AdminCart() {
  const { dark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [promo, setPromo] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/api/cart', { withCredentials: true });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [] });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products', { withCredentials: true });
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!selectedProduct) return;
    
    try {
      await api.post('/api/cart/items', {
        productId: parseInt(selectedProduct),
        quantity: quantity
      }, { withCredentials: true });
      
      fetchCart(); // Refresh cart
      setSelectedProduct('');
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart');
    }
  };

  const updateCartItem = async (itemId, newGrams) => {
    try {
      await api.put(`/api/cart/items/${itemId}?grams=${newGrams}`, {}, { withCredentials: true });
      fetchCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/api/cart/items/${itemId}`, { withCredentials: true });
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/api/cart', { withCredentials: true });
      fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.grams / 100) * item.pricePer100gAtAdd;
    }, 0);
    
    // Apply coupon discount if valid
    const applied = promo.trim().toUpperCase() === "7FOREVER";
    const discount = applied ? 20 : 0;
    
    // Store coupon for checkout
    if (applied) {
      try { localStorage.setItem("couponCode", "7FOREVER"); } catch { /* ignore */ }
    } else {
      try { localStorage.removeItem("couponCode"); } catch { /* ignore */ }
    }
    
    return Math.max(0, subtotal - discount);
  };

  const proceedToCheckout = () => {
    // Navigate to checkout page instead of directly creating order
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className={`min-h-screen py-12 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8`}>
            <div className="animate-pulse">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-300 rounded-xl"></div>
                <div className="h-64 bg-gray-300 rounded-xl"></div>
              </div>
            </div>
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
              <div className={`absolute -top-2 -right-2 w-8 h-8 ${dark ? 'bg-blue-600' : 'bg-blue-500'} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                {cart?.items?.length || 0}
              </div>
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif`}>
                Admin Cart Manager
              </h1>
              <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-lg flex items-center gap-2`}>
                <span>🔧</span>
                Test and manage cart functionality
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Product Section */}
          <div className="lg:col-span-1">
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden`}>
              <div className={`p-6 border-b ${dark ? 'border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600' : 'border-gray-100 bg-gradient-to-r from-blue-500 to-purple-500'}`}>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>➕</span>
                  Add Product
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Select Product
                  </label>
                  <select 
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                      ${dark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    <option value="">Choose a product...</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ₹{product.pricePer100g}/100g
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Quantity (units)
                  </label>
                  <div className={`flex items-center border-2 rounded-xl overflow-hidden ${dark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={`px-4 py-3 font-bold transition-colors ${dark ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`flex-1 px-4 py-3 text-center font-bold border-0 focus:outline-none ${dark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className={`px-4 py-3 font-bold transition-colors ${dark ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={addToCart}
                  disabled={!selectedProduct}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                    ${selectedProduct 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600' 
                      : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🛍️</span>
                    Add to Cart
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border overflow-hidden`}>
              <div className={`p-6 border-b ${dark ? 'border-gray-700 bg-gradient-to-r from-gray-700 to-gray-800' : 'border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                <div className="flex justify-between items-center">
                  <h2 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <span>🛒</span>
                    Cart Items ({cart?.items?.length || 0})
                  </h2>
                  {cart?.items?.length > 0 && (
                    <button 
                      onClick={clearCart}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
                        ${dark 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                        } shadow-md hover:shadow-lg transform hover:scale-105`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear Cart
                    </button>
                  )}
                </div>
              </div>
              
              {cart?.items?.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-8xl mb-6 opacity-50">🛒</div>
                  <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
                    Cart is Empty
                  </h3>
                  <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                    Add some products to test the cart functionality
                  </p>
                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${dark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                      <span className="text-2xl">🧪</span>
                      <span className={`${dark ? 'text-gray-300' : 'text-blue-700'} text-sm`}>Test adding products to cart</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${dark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                      <span className="text-2xl">💳</span>
                      <span className={`${dark ? 'text-gray-300' : 'text-purple-700'} text-sm`}>Validate checkout process</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${dark ? 'bg-gray-700' : 'bg-green-50'}`}>
                      <span className="text-2xl">🎫</span>
                      <span className={`${dark ? 'text-gray-300' : 'text-green-700'} text-sm`}>Test coupon codes</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cart.items.map((item, index) => (
                    <div key={item.id} className={`p-6 transition-all duration-300 ${dark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} group`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 rounded-full ${dark ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white text-sm font-bold`}>
                              {index + 1}
                            </div>
                            <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                              {item.product.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                              Product ID: {item.product.id}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Weight</p>
                              <p className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{item.grams}g</p>
                            </div>
                            <div>
                              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Rate</p>
                              <p className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>₹{item.pricePer100gAtAdd}/100g</p>
                            </div>
                          </div>
                          <div className={`text-2xl font-bold ${dark ? 'text-green-400' : 'text-green-600'} flex items-center gap-2`}>
                            ₹{((item.grams / 100) * item.pricePer100gAtAdd).toFixed(2)}
                            <span className={`text-sm font-normal ${dark ? 'text-gray-400' : 'text-gray-500'}`}>total</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-4">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className={`p-2 rounded-lg transition-all duration-300 ${dark ? 'hover:bg-red-600 text-gray-400 hover:text-white' : 'hover:bg-red-50 text-gray-400 hover:text-red-600'} group/remove`}
                            aria-label="Remove item"
                          >
                            <svg className="w-5 h-5 group-hover/remove:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartItem(item.id, Math.max(100, item.grams - 100))}
                              className={`w-10 h-10 rounded-xl font-bold transition-colors shadow-md ${dark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                            >
                              −
                            </button>
                            <div className="text-center min-w-[80px]">
                              <div className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{item.grams / 100}</div>
                              <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>units</div>
                            </div>
                            <button
                              onClick={() => updateCartItem(item.id, item.grams + 100)}
                              className={`w-10 h-10 rounded-xl font-bold transition-colors shadow-md ${dark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon and Total Section */}
              {cart?.items?.length > 0 && (
                <div className={`p-6 border-t ${dark ? 'border-gray-700 bg-gradient-to-b from-gray-750 to-gray-800' : 'border-gray-200 bg-gradient-to-b from-gray-50 to-white'}`}>
                  {/* Promo Code Section */}
                  {!showPromoInput && promo.trim().toUpperCase() !== "7FOREVER" ? (
                    <button
                      onClick={() => setShowPromoInput(true)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 border-dashed transition-all duration-300 mb-6
                        ${dark ? 'border-gray-600 bg-gray-700/50 hover:border-blue-600' : 'border-gray-300 bg-gray-50 hover:border-blue-400'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎫</span>
                        <span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Test Coupon Code
                        </span>
                      </div>
                      <svg className={`w-5 h-5 ${dark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : showPromoInput && promo.trim().toUpperCase() !== "7FOREVER" ? (
                    <div className="space-y-4 mb-6">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={promo}
                          onChange={e => setPromo(e.target.value)}
                          placeholder="Enter coupon code (try: 7FOREVER)"
                          className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300
                            ${dark 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        />
                        <button
                          onClick={() => setShowPromoInput(false)}
                          className={`px-4 py-3 rounded-xl transition-colors ${dark ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                        >
                          ✕
                        </button>
                      </div>
                      <div className={`text-xs p-3 rounded-lg ${dark ? 'bg-blue-900/30 text-blue-300 border border-blue-700' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                        💡 <strong>Admin Tip:</strong> Use code "7FOREVER" to test the discount functionality
                      </div>
                    </div>
                  ) : promo.trim().toUpperCase() === "7FOREVER" ? (
                    <div className={`p-4 rounded-xl border-2 mb-6 ${dark ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-300'} animate-pulse`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">✅</span>
                          <div>
                            <p className={`font-bold ${dark ? 'text-green-300' : 'text-green-700'}`}>Coupon Applied!</p>
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
                        Remove coupon
                      </button>
                    </div>
                  ) : null}
                  
                  {/* Order Summary */}
                  <div className={`space-y-3 mb-6 p-4 rounded-xl ${dark ? 'bg-gray-700' : 'bg-white'} shadow-inner`}>
                    <div className="flex justify-between items-center">
                      <span className={`${dark ? 'text-gray-300' : 'text-gray-600'} flex items-center gap-2`}>
                        <span>🛍️</span>
                        Subtotal ({cart.items.length} items)
                      </span>
                      <span className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        ₹{cart.items.reduce((total, item) => total + (item.grams / 100) * item.pricePer100gAtAdd, 0).toFixed(2)}
                      </span>
                    </div>
                    
                    {promo.trim().toUpperCase() === "7FOREVER" && (
                      <div className="flex justify-between items-center">
                        <span className={`${dark ? 'text-green-400' : 'text-green-600'} flex items-center gap-2`}>
                          <span>🎫</span>
                          Coupon Discount
                        </span>
                        <span className={`font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>- ₹20.00</span>
                      </div>
                    )}
                    
                    <div className={`flex justify-between items-center font-bold text-lg pt-3 border-t ${dark ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}>
                      <span className="flex items-center gap-2">
                        <span>💰</span>
                        Total
                      </span>
                      <span className={dark ? 'text-green-400' : 'text-green-600'}>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <button 
                    onClick={proceedToCheckout}
                    className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1
                      ${dark 
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700' 
                        : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
                      }`}
                  >
                    <span className="flex items-center justify-center gap-3">
                      <span>🛒</span>
                      Proceed to Checkout
                      <span>→</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}