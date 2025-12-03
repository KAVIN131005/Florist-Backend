import React, { useEffect, useState, useMemo, useContext } from "react";
import adminService from "../../services/adminService";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function AdminDashboard() {
  const { dark } = useContext(ThemeContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showOrderingUsers, setShowOrderingUsers] = useState(false);
  
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const s = await adminService.getPlatformStats();
        // Flexible key resolution in case backend uses different naming
        const resolve = (obj, keys, def=0) => keys.reduce((acc,k)=> acc ?? obj?.[k], null) ?? def;
        setStats({
          platformEarnings: resolve(s, ["platformEarnings","earnings","revenue","platformEarnings1"], 0),
          floristEarnings: resolve(s, ["floristEarnings","floristEarnings1"], 0),
          totalRevenue: resolve(s, ["totalRevenue","totalRevenue1"], 0),
          totalUsers: resolve(s, ["totalUsers","users","userCount","totalUsers1"], 0),
          totalFlorists: resolve(s, ["totalFlorists","florists","floristCount","totalFlorists1"], 0),
          totalOrders: resolve(s, ["totalOrders","totalOrders1"], 0),
          totalPaidOrders: resolve(s, ["totalPaidOrders","totalPaidOrders1"], 0)
        });
      } catch (e) {
        console.log("Backend stats unavailable, calculating from available data...");
        // Fallback: Calculate stats from available data
        try {
          // Get users from localStorage or estimate from orders
          let userCount = 0;
          try {
            const users = await adminService.getUsers();
            userCount = Array.isArray(users) ? users.length : 0;
          } catch {
            // Count unique users from orders across all localStorage
            const uniqueUserIds = new Set();
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith("orders:")) {
                try {
                  const userOrders = JSON.parse(localStorage.getItem(key) || "[]");
                  userOrders.forEach(order => {
                    if (order.userId || order.user?.id) {
                      uniqueUserIds.add(order.userId || order.user.id);
                    }
                  });
                } catch {}
              }
            }
            
            // Also check if there are any stored user profiles
            try {
              const storedUser = localStorage.getItem('user');
              if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user.id || user.userId) {
                  uniqueUserIds.add(user.id || user.userId);
                }
              }
            } catch {}
            
            userCount = uniqueUserIds.size;
          }

          // Get florists count from applications or products
          let floristCount = 0;
          try {
            const florists = await adminService.getFloristApplications();
            // Count approved florists only
            floristCount = Array.isArray(florists) ? florists.filter(f => f.status === 'APPROVED').length : 0;
          } catch {
            // Count unique florists from products
            const uniqueFloristIds = new Set();
            try {
              const products = JSON.parse(localStorage.getItem('products') || '[]');
              products.forEach(product => {
                if (product.floristId || product.createdBy) {
                  uniqueFloristIds.add(product.floristId || product.createdBy);
                }
              });
            } catch {}
            
            // Also check orders for florist information
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith("orders:")) {
                try {
                  const userOrders = JSON.parse(localStorage.getItem(key) || "[]");
                  userOrders.forEach(order => {
                    if (order.items) {
                      order.items.forEach(item => {
                        if (item.floristId) {
                          uniqueFloristIds.add(item.floristId);
                        }
                      });
                    }
                  });
                } catch {}
              }
            }
            
            floristCount = uniqueFloristIds.size;
          }

          setStats({
            platformEarnings: 0,
            totalUsers: userCount,
            totalFlorists: floristCount
          });
        } catch (fallbackError) {
          console.error("Error calculating fallback stats:", fallbackError);
          setStats({
            platformEarnings: 0,
            totalUsers: 0,
            totalFlorists: 0
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load all orders from backend only, fallback to local only on error
  useEffect(() => {
    let cancelled = false;
    setOrdersLoading(true);
    adminService.getAllOrders()
      .then(list => {
        if (cancelled) return;
        // Always use backend data when available, even if empty
        setOrders(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        console.log("Backend orders fetch failed, using local fallback");
        if (!cancelled) {
          // Only use localStorage as fallback when backend fails
          const localOrders = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("orders:")) {
              try { 
                localOrders.push(...JSON.parse(localStorage.getItem(key) || "[]")); 
              } catch { /* ignore parse error */ }
            }
          }
          setOrders(localOrders);
        }
      })
      .finally(() => { if (!cancelled) setOrdersLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Aggregate counts by user (id or userId) when backend provides user object; fallback to userId on order.userId
  const ordersByUser = useMemo(() => {
    const map = new Map();
    orders.forEach(o => {
      const uid = o.user?.id || o.userId || o.user?._id || "unknown";
      const name = o.user?.name || o.user?.fullName || uid;
      if (!map.has(uid)) map.set(uid, { userId: uid, name, count: 0, total: 0 });
      const entry = map.get(uid);
      entry.count += 1;
      entry.total += Number(o.total || 0);
    });
    return Array.from(map.values()).sort((a,b)=> b.count - a.count).slice(0, 5); // top 5
  }, [orders]);

  // Recent orders sorted (fallback to original order if no date) - deduplicated by ID
  const recentOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    // Deduplicate orders by ID first
    const uniqueOrders = orders.reduce((acc, order) => {
      const id = order.id || order._id;
      if (id && !acc.some(o => (o.id || o._id) === id)) {
        acc.push(order);
      }
      return acc;
    }, []);
    
    return [...uniqueOrders].sort((a,b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da; // newest first
    });
  }, [orders]);

  // Top orders by total amount - deduplicated by ID
  const topOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    // Deduplicate orders by ID first
    const uniqueOrders = orders.reduce((acc, order) => {
      const id = order.id || order._id;
      if (id && !acc.some(o => (o.id || o._id) === id)) {
        acc.push(order);
      }
      return acc;
    }, []);
    
    return [...uniqueOrders]
      .filter(o => !isNaN(Number(o.totalAmount || o.total)))
      .sort((a,b)=> Number(b.totalAmount || b.total || 0) - Number(a.totalAmount || a.total || 0))
      .slice(0,5);
  }, [orders]);



  if (loading) return <div className="p-6 text-center text-gray-500">Loading dashboard…</div>;

  // Dedicated "ordering users" focused view
  if (showOrderingUsers) {
    return (
      <div className={`p-6 space-y-6 transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-800'}`}>
        <header className="flex items-center justify-between">
          <h1 className={`text-2xl font-bold ${dark ? 'text-pink-200' : 'text-pink-600'}`}>Users Who Placed Orders</h1>
          <button 
            onClick={() => setShowOrderingUsers(false)} 
            className={`
              px-4 py-2 rounded-full transition-all duration-300
              ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-pink-100 hover:bg-pink-200'}
              shadow hover:shadow-md transform hover:scale-105
            `}
          >
            Back
          </button>
        </header>
        <div className={`
          rounded-xl shadow-lg p-4 md:p-6
          ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
        `}>
          {ordersLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className={`
                w-10 h-10 border-4 rounded-full animate-spin 
                ${dark ? 'border-pink-300 border-t-transparent' : 'border-pink-500 border-t-transparent'}
              `}></div>
            </div>
          ) : ordersByUser.length === 0 ? (
            <div className={`
              text-center p-8 rounded-lg 
              ${dark ? 'text-gray-400 bg-gray-700/30' : 'text-gray-500 bg-gray-50'}
            `}>
              No users have placed orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                <thead>
                  <tr className={`text-left border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Orders</th>
                    <th className="py-3 px-4 font-semibold">Total ₹</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersByUser.map(u => (
                    <tr 
                      key={u.userId} 
                      className={`
                        border-b last:border-0 hover:bg-opacity-30
                        ${dark 
                          ? 'border-gray-700 hover:bg-gray-700' 
                          : 'border-gray-100 hover:bg-pink-50'
                        }
                        transition-colors duration-150
                      `}
                    >
                      <td className="py-3 px-4 font-medium">{u.name}</td>
                      <td className="py-3 px-4">{u.count}</td>
                      <td className={`py-3 px-4 font-semibold ${dark ? 'text-green-300' : 'text-green-600'}`}>
                        ₹{u.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Enhanced Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-6 mb-6">
            <div className="relative">
              <div className="text-6xl animate-bounce transform hover:scale-110 transition-transform duration-300">⚡</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-6xl animate-pulse transform hover:scale-110 transition-transform duration-300">🏢</div>
            <div className="relative">
              <div className="text-6xl animate-pulse transform hover:scale-110 transition-transform duration-300">📊</div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-6">
            <h1 className={`text-4xl md:text-5xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-3 relative`}>
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                Admin Dashboard
              </span>
            </h1>
            <div className={`w-32 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse`}></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-6 font-medium`}>
            🎯 Complete platform management and analytics center
          </p>
          

          
          {/* Admin Actions Quick Bar */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link 
              to="/admin/florist-applications" 
              className={`px-8 py-4 rounded-3xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl
                ${dark ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'}`}
            >
              <span className="flex items-center gap-3">
                📝 Florist Applications
              </span>
            </Link>
            
            <Link 
              to="/admin/all-florists" 
              className={`px-8 py-4 rounded-3xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl
                ${dark ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'}`}
            >
              <span className="flex items-center gap-3">
                🌸 Manage Florists
              </span>
            </Link>
            
            <button 
              onClick={() => setShowOrderingUsers(true)} 
              className={`px-8 py-4 rounded-3xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl
                ${dark ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'}`}
            >
              <span className="flex items-center gap-3">
                📦 User Orders
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Platform Earnings Card */}
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden hover-lift relative`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 animate-gradient-x"></div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl ${dark ? 'bg-gradient-to-br from-green-600 to-emerald-600' : 'bg-gradient-to-br from-green-500 to-emerald-500'} flex items-center justify-center shadow-xl animate-pulse`}>
                  <span className="text-3xl filter drop-shadow-lg">💰</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'} animate-bounce`}>
                  ADMIN
                </div>
              </div>
              <div className="space-y-2">
                <h3 className={`text-sm font-bold ${dark ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wide`}>Admin Earnings (20%)</h3>
                <p className={`text-3xl font-bold ${dark ? 'text-green-400' : 'text-green-600'} animate-pulse-glow`}>
                  ₹{stats?.platformEarnings?.toFixed(2) || '0.00'}
                </p>
                <p className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>
                  📈 From {stats?.totalPaidOrders || 0} paid orders
                </p>
              </div>
            </div>
          </div>

          {/* Total Users Card */}
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden hover-lift relative`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 animate-gradient-x"></div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl ${dark ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-indigo-500'} flex items-center justify-center shadow-xl animate-pulse`}>
                  <span className="text-3xl filter drop-shadow-lg">👥</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${dark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'} animate-bounce`}>
                  USERS
                </div>
              </div>
              <div className="space-y-2">
                <h3 className={`text-sm font-bold ${dark ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wide`}>Total Users</h3>
                <p className={`text-3xl font-bold ${dark ? 'text-blue-400' : 'text-blue-600'} animate-pulse-glow`}>
                  {stats?.totalUsers?.toLocaleString() || '0'}
                </p>
                <p className={`text-sm ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
                  👤 Registered customers
                </p>
              </div>
            </div>
          </div>

          {/* Total Florists Card */}
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden hover-lift relative`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500 animate-gradient-x"></div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl ${dark ? 'bg-gradient-to-br from-pink-600 to-rose-600' : 'bg-gradient-to-br from-pink-500 to-rose-500'} flex items-center justify-center shadow-xl animate-pulse`}>
                  <span className="text-3xl filter drop-shadow-lg">🌸</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${dark ? 'bg-pink-900 text-pink-300' : 'bg-pink-100 text-pink-700'} animate-bounce`}>
                  FLORISTS
                </div>
              </div>
              <div className="space-y-2">
                <h3 className={`text-sm font-bold ${dark ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wide`}>Active Florists</h3>
                <p className={`text-3xl font-bold ${dark ? 'text-pink-400' : 'text-pink-600'} animate-pulse-glow`}>
                  {stats?.totalFlorists?.toLocaleString() || '0'}
                </p>
                <p className={`text-sm ${dark ? 'text-pink-400' : 'text-pink-600'}`}>
                  🏪 Vendor partners
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Activity & Revenue Split Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Overview */}
        <div className="lg:col-span-2">
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    📦 Recent Orders
                  </h3>
                  <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    Latest platform transactions and activity
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-2xl ${dark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'} text-sm font-bold animate-pulse`}>
                  {recentOrders.length} Orders
                </div>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-full border-4 border-t-transparent animate-spin ${dark ? 'border-blue-400' : 'border-blue-500'}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl animate-ping">📋</span>
                    </div>
                  </div>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className={`text-center p-12 rounded-3xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-100'}`}>
                  <div className="text-6xl mb-4 animate-bounce">📪</div>
                  <h4 className={`text-xl font-bold ${dark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                    No Orders Yet
                  </h4>
                  <p className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Orders will appear here once customers start purchasing
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {recentOrders.slice(0, 10).map((order, index) => (
                    <div 
                      key={order.id || order._id}
                      className={`
                        p-6 rounded-2xl border transition-all duration-300 hover-lift
                        ${dark ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md'}
                        transform hover:scale-[1.01]
                      `}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${dark ? 'bg-blue-600' : 'bg-blue-100'} animate-pulse`}>
                              <span className="text-sm font-bold">#{index + 1}</span>
                            </div>
                            <div>
                              <p className={`font-mono text-xs ${dark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                                ID: {(order.id || order._id)?.toString().slice(-8)}
                              </p>
                              <p className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                {order.user?.name || order.user?.fullName || 'Customer'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`
                              px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-2
                              ${order.status === 'DELIVERED' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : order.status === 'FAILED' 
                                  ? 'bg-red-100 text-red-700 border border-red-200' 
                                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              }
                            `}>
                              {order.status === 'DELIVERED' && '✅'}
                              {order.status === 'FAILED' && '❌'}
                              {!['DELIVERED', 'FAILED'].includes(order.status) && '🚚'}
                              {order.status}
                            </span>
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
                              ₹{Number(order.total || 0).toFixed(2)}
                            </span>
                            
                            <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                              📅 {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Split Card */}
        <div className="space-y-6">
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500 animate-gradient-x"></div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4 animate-bounce">💎</div>
                <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Revenue Breakdown
                </h3>
                <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Total earnings distribution
                </p>
              </div>

              <div className="space-y-6">
                {/* Gross Revenue */}
                <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'}`}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <p className={`text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                      Gross Revenue
                    </p>
                    <p className={`text-2xl font-bold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
                      ₹{stats?.totalRevenue?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>

                {/* Admin Share */}
                <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100'}`}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏛️</div>
                    <p className={`text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                      Platform Share (20%)
                    </p>
                    <p className={`text-xl font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>
                      ₹{stats?.platformEarnings?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>

                {/* Florist Share */}
                <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100'}`}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🌸</div>
                    <p className={`text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                      Florists Share (80%)
                    </p>
                    <p className={`text-xl font-bold ${dark ? 'text-purple-400' : 'text-purple-600'}`}>
                      ₹{stats?.floristEarnings?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>

                {/* Order Count */}
                <div className={`p-4 rounded-2xl ${dark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-50 text-yellow-700'} border ${dark ? 'border-yellow-700' : 'border-yellow-200'}`}>
                  <div className="text-center">
                    <p className="text-sm font-semibold mb-1">Paid Orders</p>
                    <p className="text-lg font-bold">{stats?.totalPaidOrders || 0} orders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Orders Preview */}
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500 animate-gradient-x"></div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl mb-2">🏆</div>
                <h4 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                  Top Orders
                </h4>
              </div>

              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2 animate-spin">⏳</div>
                  <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Loading top orders...</p>
                </div>
              ) : topOrders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2 animate-pulse">📊</div>
                  <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>No high-value orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topOrders.slice(0, 5).map((order, index) => (
                    <div 
                      key={order.id || order._id}
                      className={`
                        p-4 rounded-2xl border transition-all duration-300 hover-lift
                        ${dark ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-100'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${dark ? 'bg-yellow-600 text-white' : 'bg-yellow-500 text-white'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className={`font-mono text-xs ${dark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                              {(order.id || order._id || '').toString().slice(-6)}
                            </p>
                            <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                              {(order.user?.name || order.user?.fullName || 'Customer').slice(0, 12)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`text-lg font-bold ${dark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            ₹{Number(order.total || 0).toFixed(0)}
                          </p>
                          <span className={`
                            text-xs px-2 py-1 rounded-full font-medium
                            ${order.status === 'DELIVERED' 
                              ? 'bg-green-100 text-green-700' 
                              : order.status === 'FAILED' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-gray-100 text-gray-700'
                            }
                          `}>
                            {order.status === 'DELIVERED' && '✅'}
                            {order.status === 'FAILED' && '❌'}
                            {!['DELIVERED', 'FAILED'].includes(order.status) && '⏳'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Ordering Modal */}
      {showOrderingUsers && (
        <Modal
          onClose={() => setShowOrderingUsers(false)}
          className={`max-w-6xl ${dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">👥 User Order Analytics</h2>
                <p className={`${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Comprehensive user ordering behavior and statistics
                </p>
              </div>
              <button
                onClick={() => setShowOrderingUsers(false)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${dark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              >
                ✕
              </button>
            </div>
            
            <AllOrders />
          </div>
        </Modal>
      )}
    </div>
  );
}
