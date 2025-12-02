import React, { useEffect, useState, useContext } from "react";
import adminService from "../../services/adminService";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function AllOrders(){
  const { dark } = useContext(ThemeContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders();
      setOrders(data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!confirm(`Mark order as ${newStatus}?`)) return;
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      await load();
      alert(`Order status updated to ${newStatus}`);
    } catch (e) {
      console.error("Status update error:", e);
      alert("Status update failed");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.id?.toString() || order.user?.name || order.user?.email || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ["ALL", "PROCESSING", "SHIPPED", "DELIVERED", "FAILED"];

  if (loading) return (
    <div className={`min-h-screen flex justify-center items-center ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      <div className="text-center">
        <div className="relative mb-8">
          <div className={`w-20 h-20 rounded-full border-4 border-t-transparent animate-spin ${dark ? 'border-blue-400' : 'border-blue-500'}`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl animate-ping">📦</span>
          </div>
        </div>
        <p className={`text-xl font-semibold ${dark ? 'text-blue-300' : 'text-blue-600'} animate-pulse`}>
          Loading Orders...
        </p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      {/* Enhanced Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="relative">
              <div className="text-6xl animate-bounce transform hover:scale-110 transition-transform duration-300">📦</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-6xl animate-pulse transform hover:scale-110 transition-transform duration-300">📋</div>
            <div className="relative">
              <div className="text-6xl animate-pulse transform hover:scale-110 transition-transform duration-300">🚚</div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-4 relative`}>
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
                Order Management
              </span>
            </h1>
            <div className="w-48 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-8 font-medium max-w-2xl mx-auto`}>
            🎯 Comprehensive order tracking and status management dashboard
          </p>
          


          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center mb-8">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search orders by ID, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  w-full px-6 py-4 pl-12 rounded-3xl border focus:ring-2 focus:ring-blue-400 focus:border-blue-500
                  ${dark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }
                  shadow-lg transition-all duration-300 hover:shadow-xl
                `}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                🔍
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`
                px-6 py-4 rounded-3xl border focus:ring-2 focus:ring-blue-400 focus:border-blue-500
                ${dark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
                }
                shadow-lg transition-all duration-300 hover:shadow-xl
              `}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === "ALL" ? "All Statuses" : status}
                </option>
              ))}
            </select>
            
            <div className={`flex items-center gap-4 px-8 py-4 rounded-3xl ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-lg`}>
              <div className="text-3xl animate-pulse">📊</div>
              <div>
                <p className={`text-2xl font-bold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {filteredOrders.length}
                </p>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {searchTerm || statusFilter !== "ALL" ? 'Filtered' : 'Total'} Orders
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Orders Table/Cards */}
        {filteredOrders.length === 0 ? (
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden`}>
            <div className="p-16 text-center">
              <div className="text-8xl mb-8 animate-bounce">{searchTerm || statusFilter !== "ALL" ? '🔍' : '📦'}</div>
              <h3 className={`text-3xl font-bold ${dark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                {searchTerm || statusFilter !== "ALL" ? 'No Matching Orders' : 'No Orders Yet'}
              </h3>
              <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-500'} mb-8 max-w-md mx-auto`}>
                {searchTerm || statusFilter !== "ALL"
                  ? 'No orders match your search criteria. Try adjusting your filters.'
                  : 'No orders have been placed yet. Orders will appear here once customers start purchasing.'
                }
              </p>
              {(searchTerm || statusFilter !== "ALL") && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('ALL');
                  }}
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${dark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                  <span>🔄</span>
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order, index) => (
              <div 
                key={order.id}
                className={`
                  ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
                  rounded-3xl border shadow-2xl overflow-hidden hover-lift relative
                  transform transition-all duration-300 hover:scale-[1.01]
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-gradient-x"></div>
                
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Order Info */}
                    <div className="flex-1 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-2xl ${dark ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-indigo-500'} flex items-center justify-center shadow-xl animate-pulse`}>
                          <span className="text-3xl filter drop-shadow-lg">📦</span>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                            Order #{order.id?.toString().slice(-8) || 'N/A'}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className={`
                              px-4 py-2 rounded-2xl text-sm font-bold animate-pulse
                              ${order.status === 'DELIVERED' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : order.status === 'FAILED' 
                                  ? 'bg-red-100 text-red-700 border border-red-200' 
                                  : order.status === 'SHIPPED'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : order.status === 'PROCESSING'
                                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                              }
                            `}>
                              {order.status === 'DELIVERED' && '✅'}
                              {order.status === 'FAILED' && '❌'}
                              {order.status === 'SHIPPED' && '🚚'}
                              {order.status === 'PROCESSING' && '⏳'}
                              {!['DELIVERED', 'FAILED', 'SHIPPED', 'PROCESSING'].includes(order.status) && '📋'}
                              {order.status}
                            </span>
                            
                            <span className={`px-4 py-2 rounded-2xl text-sm font-bold ${dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
                              ₹{order.totalAmount?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          
                          {/* Customer Information */}
                          <div className={`p-4 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-100'} mb-4`}>
                            <h4 className={`font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
                              👤 Customer Details
                            </h4>
                            <div className="space-y-1">
                              <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                                <span className="font-medium">Name:</span> {order.user?.name || order.user?.fullName || 'N/A'}
                              </p>
                              {order.user?.email && (
                                <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                                  <span className="font-medium">Email:</span> {order.user.email}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Order Metadata */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-2xl ${dark ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-700'} border ${dark ? 'border-blue-700' : 'border-blue-100'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm">🆔</span>
                                <span className="text-xs font-semibold">Order ID</span>
                              </div>
                              <p className="text-sm font-medium font-mono">{order.id}</p>
                            </div>
                            
                            {order.createdAt && (
                              <div className={`p-4 rounded-2xl ${dark ? 'bg-purple-900 text-purple-200' : 'bg-purple-50 text-purple-700'} border ${dark ? 'border-purple-700' : 'border-purple-100'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm">📅</span>
                                  <span className="text-xs font-semibold">Placed On</span>
                                </div>
                                <p className="text-sm font-medium">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4 lg:min-w-[200px]">
                      <button 
                        onClick={() => window.location = `/admin/orders/${order.id}`} 
                        className={`
                          px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl
                          ${dark ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800' : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'}
                          flex items-center justify-center gap-3
                        `}
                      >
                        <span className="text-xl">👁️</span>
                        View Details
                      </button>
                      
                      {order.status !== 'SHIPPED' && order.status !== 'DELIVERED' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'SHIPPED')} 
                          className={`
                            px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl
                            ${dark ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'}
                            flex items-center justify-center gap-3
                          `}
                        >
                          <span className="text-xl">🚚</span>
                          Mark Shipped
                        </button>
                      )}
                      
                      {order.status !== 'DELIVERED' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'DELIVERED')} 
                          className={`
                            px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl
                            ${dark ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'}
                            flex items-center justify-center gap-3
                          `}
                        >
                          <span className="text-xl">✅</span>
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
