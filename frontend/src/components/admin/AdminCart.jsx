import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/themeContextDefinition';
import api from '../../services/api';

export default function AdminCart() {
  const { dark } = useContext(ThemeContext);
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

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
    return cart.items.reduce((total, item) => {
      return total + (item.grams / 100) * item.pricePer100gAtAdd;
    }, 0);
  };

  const proceedToCheckout = () => {
    // Convert cart to order format and create order
    const cartItems = cart.items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.pricePer100gAtAdd,
      quantity: item.grams / 100, // Convert grams to units
      floristId: item.product.florist?.id || 1,
      floristName: item.product.florist?.name || 'Unknown Florist',
      floristUsername: item.product.florist?.username || 'unknown'
    }));

    // For demo purposes, create a test order
    const orderData = {
      cartItems: cartItems,
      deliveryAddress: 'Admin Test Address',
      totalAmount: calculateTotal()
    };

    api.post('/api/orders', orderData, { withCredentials: true })
      .then(response => {
        alert(`Order created successfully! Order ID: ${response.data.id}`);
        clearCart();
      })
      .catch(error => {
        console.error('Error creating order:', error);
        alert('Error creating order');
      });
  };

  if (loading) {
    return (
      <div className={`p-6 ${dark ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${dark ? 'bg-gray-900 text-white' : 'bg-white'} min-h-screen`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Cart Management</h1>
        
        {/* Add Product to Cart */}
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6 mb-6`}>
          <h2 className="text-xl font-semibold mb-4">Add Product to Cart</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Product</label>
              <select 
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className={`w-full p-2 rounded border ${
                  dark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
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
              <label className="block text-sm font-medium mb-2">Quantity (units)</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className={`w-full p-2 rounded border ${
                  dark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={addToCart}
                disabled={!selectedProduct}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden`}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Cart Items ({cart?.items?.length || 0})</h2>
              {cart?.items?.length > 0 && (
                <button 
                  onClick={clearCart}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>
          
          {cart?.items?.length === 0 ? (
            <div className="p-8 text-center">
              <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Your cart is empty</p>
              <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Add some products to get started</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {cart.items.map(item => (
                  <div key={item.id} className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{item.product.name}</h3>
                        <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.grams}g @ ₹{item.pricePer100gAtAdd}/100g
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          ₹{((item.grams / 100) * item.pricePer100gAtAdd).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartItem(item.id, Math.max(100, item.grams - 100))}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="min-w-[60px] text-center">{item.grams / 100} units</span>
                          <button
                            onClick={() => updateCartItem(item.id, item.grams + 100)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cart Total and Checkout */}
              <div className={`p-6 border-t ${dark ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">Total: ₹{calculateTotal().toFixed(2)}</p>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {cart.items.length} item(s) in cart
                    </p>
                  </div>
                  <button 
                    onClick={proceedToCheckout}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
                  >
                    Create Test Order
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}