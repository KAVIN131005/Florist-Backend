import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function OrdersReceived() {
  const { dark } = useContext(ThemeContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const { user } = useAuth();
  const floristName = user?.name || user?.fullName || "";
  const floristId = user?.id || user?._id || user?.userId;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    
    axios.get("/api/orders/received")
      .then(res => { 
        if (!cancelled) {
          setOrders(res.data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        // Fallback: aggregate from all local user orders
        const localOrders = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("orders:")) {
            try {
              const arr = JSON.parse(localStorage.getItem(key) || "[]");
              localOrders.push(...arr);
            } catch { /* ignore */ }
          }
        }
        if (!cancelled) {
          setOrders(localOrders);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Filter orders to only those containing this florist's products
  const filteredOrders = orders.map(o => ({
    ...o,
    floristItems: (o.items || []).filter(it =>
      (it.floristId && floristId && String(it.floristId) === String(floristId)) ||
      (it.floristName && floristName && it.floristName.toLowerCase() === floristName.toLowerCase())
    ),
  })).filter(o => o.floristItems.length > 0)
    .filter(o => filterStatus === "" || o.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case "date": return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
        case "amount": return (b.floristItems.reduce((sum, it) => sum + (it.price * it.quantity), 0)) - (a.floristItems.reduce((sum, it) => sum + (it.price * it.quantity), 0));
        case "status": return a.status.localeCompare(b.status);
        default: return 0;
      }
    });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return dark ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800";
      case "paid": case "processing": return dark ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800";
      case "shipped": return dark ? "bg-indigo-900 text-indigo-200" : "bg-indigo-100 text-indigo-800";
      case "delivered": return dark ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800";
      case "cancelled": return dark ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800";
      default: return dark ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "⏳";
      case "paid": case "processing": return "🔄";
      case "shipped": return "🚚";
      case "delivered": return "✅";
      case "cancelled": return "❌";
      default: return "📋";
    }
  };

  if (loading) return (
    <div className={`min-h-screen flex justify-center items-center ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      <div className="text-center">
        <div className="relative mb-8">
          <div className={`w-20 h-20 rounded-full border-4 border-t-transparent animate-spin ${dark ? 'border-indigo-400' : 'border-indigo-500'}`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-ping">📦</span>
          </div>
        </div>
        <p className={`text-xl font-semibold ${dark ? 'text-indigo-300' : 'text-indigo-600'} animate-pulse`}>
          Loading Orders...
        </p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      {/* Enhanced Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="relative">
              <div className="text-7xl animate-bounce transform hover:scale-110 transition-transform duration-300">📦</div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">🛍️</div>
            <div className="relative">
              <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">🌸</div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <h1 className={`text-5xl md:text-6xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-6 relative`}>
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                Orders Received
              </span>
            </h1>
            <div className="w-32 h-1 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-8 font-medium`}>
            🌺 Manage and track your customer orders
          </p>
          

        </div>
      </div>

      {/* Control Panel */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative p-6`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`
                  px-4 py-3 rounded-2xl border-2 transition-all duration-300 min-w-48
                  ${dark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-indigo-200
                `}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">⏳ Pending</option>
                <option value="PAID">💰 Paid</option>
                <option value="PROCESSING">🔄 Processing</option>
                <option value="SHIPPED">🚚 Shipped</option>
                <option value="DELIVERED">✅ Delivered</option>
                <option value="CANCELLED">❌ Cancelled</option>
              </select>
              
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`
                  px-4 py-3 rounded-2xl border-2 transition-all duration-300 min-w-48
                  ${dark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-indigo-200
                `}
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
            
            {/* Statistics */}
            <div className="flex gap-4 text-center">
              <div className={`px-6 py-3 rounded-2xl ${dark ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                <div className={`text-2xl font-bold ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {filteredOrders.length}
                </div>
                <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Orders
                </div>
              </div>
              <div className={`px-6 py-3 rounded-2xl ${dark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                <div className={`text-2xl font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>
                  ₹{filteredOrders.reduce((sum, o) => sum + o.floristItems.reduce((itemSum, it) => itemSum + (it.price * it.quantity), 0), 0).toFixed(0)}
                </div>
                <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Revenue
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Display */}
      <div className="max-w-7xl mx-auto">
        {filteredOrders.length === 0 ? (
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl p-12 text-center`}>
            <div className="text-8xl mb-6 animate-bounce">📦</div>
            <h3 className={`text-2xl font-bold ${dark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              {filterStatus ? 'No Orders with this Status' : 'No Orders Received Yet'}
            </h3>
            <p className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {filterStatus 
                ? 'Try changing the filter to see more orders.'
                : 'Orders containing your products will appear here once customers start purchasing.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const orderId = order.id || order._id || order.orderId || "";
              const orderTotal = order.floristItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
              
              return (
                <div
                  key={orderId}
                  className={`
                    ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
                    rounded-3xl border shadow-lg hover:shadow-2xl 
                    transition-all duration-300 transform hover:scale-[1.02]
                    overflow-hidden relative
                  `}
                >
                  {/* Status Stripe */}
                  <div className={`
                    absolute top-0 left-0 w-full h-1 
                    ${order.status === 'DELIVERED' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                      order.status === 'SHIPPED' ? 'bg-gradient-to-r from-blue-400 to-indigo-400' :
                      order.status === 'PROCESSING' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                      order.status === 'PAID' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                      'bg-gradient-to-r from-gray-400 to-gray-500'
                    }
                  `}></div>
                  
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                            Order #{orderId.slice(-8).toUpperCase()}
                          </h3>
                          <span className={`
                            flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                            ${getStatusColor(order.status)}
                          `}>
                            <span>{getStatusIcon(order.status)}</span>
                            {order.status || 'UNKNOWN'}
                          </span>
                        </div>
                        
                        {order.user?.name && (
                          <p className={`flex items-center gap-2 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <span>👤</span>
                            <span>Customer: <strong>{order.user.name}</strong></span>
                          </p>
                        )}
                        
                        {(order.createdAt || order.date) && (
                          <p className={`flex items-center gap-2 ${dark ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1`}>
                            <span>📅</span>
                            <span>{new Date(order.createdAt || order.date).toLocaleDateString()}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${dark ? 'text-green-400' : 'text-green-600'} mb-2`}>
                          ₹{orderTotal.toFixed(2)}
                        </div>
                        <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {order.floristItems.length} item{order.floristItems.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      <h4 className={`font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'} flex items-center gap-2`}>
                        <span>🌸</span>
                        Your Products in this Order:
                      </h4>
                      
                      <div className="grid gap-3">
                        {order.floristItems.map((item, idx) => (
                          <div 
                            key={idx}
                            className={`
                              p-4 rounded-2xl border transition-all duration-300
                              ${dark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}
                            `}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex-1 min-w-0">
                                <h5 className={`font-semibold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
                                  {item.name}
                                </h5>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Qty: <strong>{item.quantity}</strong>
                                  </span>
                                  <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Unit: <strong>₹{item.price}</strong>
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-lg font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}\n                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                      <Link
                        to={`/florist/orders/${orderId}`}
                        className={`
                          flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold 
                          transition-all duration-300 transform hover:scale-105 flex-1
                          ${dark 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white' 
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'
                          }
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400
                        `}
                      >
                        <span>👁️</span>
                        <span>View Details</span>
                      </Link>
                      
                      {(order.status === 'PAID' || order.status === 'PROCESSING') && (
                        <button
                          className={`
                            flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold 
                            transition-all duration-300 transform hover:scale-105 
                            ${dark 
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' 
                              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                            }
                          `}
                          onClick={() => {
                            // Handle mark as shipped/completed
                            alert('Order status update functionality would be implemented here');
                          }}
                        >
                          <span>🚚</span>
                          <span>Mark Shipped</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
