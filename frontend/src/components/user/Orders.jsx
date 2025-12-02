import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import orderService from "../../services/orderService";
import { useAuth } from "../../hooks/useAuth";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const userId = user?.id || user?._id || user?.userId;
  const { dark } = useContext(ThemeContext);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // If we have a logged in user try backend, else just read guest/local
      if (userId) {
        try {
          const backendOrders = await orderService.myOrders();
          if (!cancelled) setOrders(backendOrders || []);
          return;
        } catch {
          // fall through to local
        }
      }
      const local = orderService.getLocalOrders(userId); // userId may be undefined -> guest key logic inside service
      if (!cancelled) setOrders(local);
    };
    load();
    return () => { cancelled = true; };
  }, [userId]);

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'}`}>
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="text-5xl animate-bounce">📦</div>
            <div className="text-5xl">📋</div>
            <div className="text-5xl animate-pulse">🌸</div>
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-2`}>
            My Orders
          </h1>
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
            Track and manage all your flower orders
          </p>
        </div>

        {!userId && (
          <div className={`max-w-2xl mx-auto mb-8 p-6 rounded-2xl border-l-4 ${dark ? 'text-gray-300 bg-gray-800 border-yellow-500' : 'text-gray-700 bg-yellow-50 border-yellow-400'} shadow-lg`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className={`font-semibold mb-1 ${dark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  Viewing Guest Orders
                </h3>
                <p className="text-sm mb-2">
                  You're currently viewing local orders. Sign in to access your complete order history and get better tracking.
                </p>
                <Link 
                  to="/login" 
                  className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105
                    ${dark 
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    }`}
                >
                  <span>🔐</span>
                  Sign In Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="max-w-6xl mx-auto">
        {orders.length === 0 ? (
          <div className={`text-center p-12 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl shadow-xl border`}>
            <div className="text-8xl mb-6 opacity-50 animate-pulse">📦</div>
            <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-4`}>
              No Orders Yet
            </h2>
            <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} max-w-md mx-auto mb-8 text-lg leading-relaxed`}>
              You haven't placed any orders yet. Start shopping for beautiful fresh flowers and watch your orders appear here.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className={`flex items-center gap-3 p-3 rounded-lg ${dark ? 'bg-gray-700' : 'bg-pink-50'} mx-auto max-w-sm`}>
                <span className="text-2xl">🌹</span>
                <span className={`${dark ? 'text-gray-300' : 'text-pink-700'} text-sm`}>Fresh flowers delivered daily</span>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${dark ? 'bg-gray-700' : 'bg-purple-50'} mx-auto max-w-sm`}>
                <span className="text-2xl">📱</span>
                <span className={`${dark ? 'text-gray-300' : 'text-purple-700'} text-sm`}>Easy order tracking</span>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${dark ? 'bg-gray-700' : 'bg-blue-50'} mx-auto max-w-sm`}>
                <span className="text-2xl">🚚</span>
                <span className={`${dark ? 'text-gray-300' : 'text-blue-700'} text-sm`}>Fast & reliable delivery</span>
              </div>
            </div>
            
            <Link 
              to="/shop" 
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-lg
                ${dark 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                } 
                transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1`}
            >
              <span>🛍️</span>
              Start Shopping
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            {/* Order Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className={`p-6 rounded-2xl text-center ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-lg`}>
                <div className="text-3xl mb-2">📦</div>
                <div className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{orders.length}</div>
                <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</div>
              </div>
              
              <div className={`p-6 rounded-2xl text-center ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-lg`}>
                <div className="text-3xl mb-2">✅</div>
                <div className={`text-2xl font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </div>
                <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Delivered</div>
              </div>
              
              <div className={`p-6 rounded-2xl text-center ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-lg`}>
                <div className="text-3xl mb-2">🚚</div>
                <div className={`text-2xl font-bold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {orders.filter(o => ['SHIPPED', 'PROCESSING'].includes(o.status)).length}
                </div>
                <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>In Transit</div>
              </div>
              
              <div className={`p-6 rounded-2xl text-center ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-lg`}>
                <div className="text-3xl mb-2">💰</div>
                <div className={`text-2xl font-bold ${dark ? 'text-pink-400' : 'text-pink-600'}`}>
                  ₹{orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0).toFixed(0)}
                </div>
                <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Total Spent</div>
              </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {orders.map(order => (
                <div 
                  key={order.id} 
                  className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden border transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1`}
                >
                  {/* Order Header */}
                  <div className={`p-6 border-b ${dark ? 'border-gray-700 bg-gradient-to-r from-gray-750 to-gray-800' : 'border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full ${dark ? 'bg-pink-600' : 'bg-pink-500'} flex items-center justify-center text-white font-bold text-lg`}>
                          #{order.id.toString().slice(-2)}
                        </div>
                        <div>
                          <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Order ID</p>
                          <p className={`font-mono font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>#{order.id}</p>
                        </div>
                      </div>
                      <div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2
                          ${order.status === 'DELIVERED' ? (dark ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700') : 
                            order.status === 'SHIPPED' ? (dark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700') : 
                            order.status === 'PROCESSING' ? (dark ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700') : 
                            order.status === 'CANCELLED' ? (dark ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700') : 
                            (dark ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700')
                          }`}>
                          {order.status === 'DELIVERED' ? '✅' : 
                           order.status === 'SHIPPED' ? '🚚' : 
                           order.status === 'PROCESSING' ? '⏳' : 
                           order.status === 'CANCELLED' ? '❌' : '📦'}
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Amount</p>
                        <p className={`text-2xl font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>
                          ₹{order.totalAmount || '0.00'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Order Date</p>
                        <p className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'N/A'}
                        </p>
                        <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🛍️</span>
                      <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Order Items ({order.items?.length || 0})
                      </p>
                    </div>
                    
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-3 max-h-32 overflow-y-auto pr-2">
                        {order.items.map((item, index) => (
                          <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${dark ? 'bg-gray-700' : 'bg-gray-50'} group`}>
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-8 h-8 rounded-full ${dark ? 'bg-pink-600' : 'bg-pink-500'} flex items-center justify-center text-white text-xs font-bold`}>
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium text-sm truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
                                  {item.productName}
                                </p>
                                <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {item.grams}g
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>
                                ₹{item.subtotal?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center p-6 rounded-lg ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="text-4xl mb-2 opacity-50">📦</div>
                        <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          No item details available
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Track Order Button */}
                  <Link 
                    to={`/orders/${order.id}`} 
                    className={`block w-full text-center py-4 font-bold text-white transition-all duration-300 
                      ${dark 
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700' 
                        : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                      } flex items-center justify-center gap-3 group`}
                  >
                    <span>📍</span>
                    <span>Track Order</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
