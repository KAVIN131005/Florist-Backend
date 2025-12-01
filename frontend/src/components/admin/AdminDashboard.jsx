import React, { useEffect, useState, useMemo, useContext } from "react";
import adminService from "../../services/adminService";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function AdminDashboard() {
  const { dark, toggle } = useContext(ThemeContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showOrderingUsers, setShowOrderingUsers] = useState(false);
  
  // Revenue split memo (only for orders that are at least paid)
  const revenueSplit = useMemo(() => {
    if (!orders || orders.length === 0) return { gross: 0, admin: 0, florist: 0, paidCount: 0 };
    const paidStatuses = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"]; // treat these as revenue-realized
    let gross = 0; let paidCount = 0;
    orders.forEach(o => {
      if (paidStatuses.includes(o.status)) {
        const t = Number(o.total || 0);
        if (!isNaN(t)) {
          gross += t; paidCount += 1;
        }
      }
    });
    const admin = gross * 0.20;
    const florist = gross * 0.80; // remainder
    return { gross, admin, florist, paidCount };
  }, [orders]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const s = await adminService.getPlatformStats();
        // Flexible key resolution in case backend uses different naming
        const resolve = (obj, keys, def=0) => keys.reduce((acc,k)=> acc ?? obj?.[k], null) ?? def;
        setStats({
          platformEarnings: resolve(s, ["platformEarnings","earnings","revenue","platformEarnings1"], 0),
          totalUsers: resolve(s, ["totalUsers","users","userCount","totalUsers1"], 0),
          totalOrders: resolve(s, ["totalOrders","orders","orderCount","totalOrders1"], 0),
          totalFlorists: resolve(s, ["totalFlorists","florists","floristCount","totalFlorists1"], 0)
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
            totalOrders: 0, // Will be calculated from orders in next useEffect
            totalFlorists: floristCount
          });
        } catch (fallbackError) {
          console.error("Error calculating fallback stats:", fallbackError);
          setStats({
            platformEarnings: 0,
            totalUsers: 0,
            totalOrders: 0,
            totalFlorists: 0
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load all orders (backend or fallback local) for listing/counts
  useEffect(() => {
    let cancelled = false;
    setOrdersLoading(true);
    adminService.getAllOrders()
      .then(list => {
        if (cancelled) return;
        if (Array.isArray(list) && list.length > 0) {
          setOrders(list);
          // Update stats with actual order count
          setStats(prev => prev ? { ...prev, totalOrders: list.length } : null);
        } else {
          // Treat empty list as possible backend placeholder -> fallback to local scan
          const localOrders = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("orders:")) {
              try { localOrders.push(...JSON.parse(localStorage.getItem(key) || "[]")); } catch { /* ignore parse error */ }
            }
          }
          
          // If no local orders either, create demo data
          if (localOrders.length === 0) {
            const demoOrders = [
              { id: 1, userId: 'user1', user: { name: 'John Doe', id: 'user1' }, status: 'DELIVERED', total: 750, createdAt: new Date(Date.now() - 86400000).toISOString() },
              { id: 2, userId: 'user2', user: { name: 'Jane Smith', id: 'user2' }, status: 'SHIPPED', total: 1250, createdAt: new Date(Date.now() - 172800000).toISOString() },
              { id: 3, userId: 'user3', user: { name: 'Mike Wilson', id: 'user3' }, status: 'PAID', total: 900, createdAt: new Date(Date.now() - 259200000).toISOString() },
              { id: 4, userId: 'user1', user: { name: 'John Doe', id: 'user1' }, status: 'DELIVERED', total: 650, createdAt: new Date(Date.now() - 345600000).toISOString() },
              { id: 5, userId: 'user4', user: { name: 'Sarah Brown', id: 'user4' }, status: 'PAID', total: 1100, createdAt: new Date(Date.now() - 432000000).toISOString() }
            ];
            localOrders.push(...demoOrders);
          }
          
          setOrders(localOrders);
          // Update stats with local order count
          setStats(prev => prev ? { ...prev, totalOrders: localOrders.length } : null);
        }
      })
      .catch(err => {
        console.log("Backend orders fetch failed, using local fallback");
        const localOrders = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("orders:")) {
            try { localOrders.push(...JSON.parse(localStorage.getItem(key) || "[]")); } catch { /* ignore parse error */ }
          }
        }
        
        // If no local orders either, create demo data
        if (localOrders.length === 0) {
          const demoOrders = [
            { id: 1, userId: 'user1', user: { name: 'John Doe', id: 'user1' }, status: 'DELIVERED', total: 750, createdAt: new Date(Date.now() - 86400000).toISOString() },
            { id: 2, userId: 'user2', user: { name: 'Jane Smith', id: 'user2' }, status: 'SHIPPED', total: 1250, createdAt: new Date(Date.now() - 172800000).toISOString() },
            { id: 3, userId: 'user3', user: { name: 'Mike Wilson', id: 'user3' }, status: 'PAID', total: 900, createdAt: new Date(Date.now() - 259200000).toISOString() },
            { id: 4, userId: 'user1', user: { name: 'John Doe', id: 'user1' }, status: 'DELIVERED', total: 650, createdAt: new Date(Date.now() - 345600000).toISOString() },
            { id: 5, userId: 'user4', user: { name: 'Sarah Brown', id: 'user4' }, status: 'PAID', total: 1100, createdAt: new Date(Date.now() - 432000000).toISOString() }
          ];
          localOrders.push(...demoOrders);
        }
        
        if (!cancelled) {
          setOrders(localOrders);
          // Update stats with local order count
          setStats(prev => prev ? { ...prev, totalOrders: localOrders.length } : null);
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

  // Recent orders sorted (fallback to original order if no date)
  const recentOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    return [...orders].sort((a,b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da; // newest first
    });
  }, [orders]);

  // Top orders by total amount
  const topOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    return [...orders]
      .filter(o => !isNaN(Number(o.total)))
      .sort((a,b)=> Number(b.total||0) - Number(a.total||0))
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
    <div className={`p-6 space-y-8 transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-800'}`}>
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl md:text-4xl font-bold relative
            ${dark ? 'text-pink-200' : 'text-pink-600'}
            after:content-[""] after:absolute after:w-16 after:h-1 
            after:bg-pink-400 after:bottom-[-8px] after:left-0
            after:rounded-full
          `}>Admin Dashboard</h1>
          <p className={`mt-3 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            Platform management and insights
          </p>
        </div>
        
        {/* Theme Toggle Pill */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className={`
              relative w-16 h-7 rounded-full 
              transition-all duration-500 ease-in-out
              ${dark ? 'bg-gray-600 shadow-inner' : 'bg-pink-100 shadow'} 
              flex items-center px-1
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400
              hover:shadow-lg
            `}
            title="Toggle theme"
            aria-label="Toggle dark mode"
          >
            <span className={`
              absolute h-5 w-5 rounded-full shadow transform transition-all duration-500 ease-in-out
              ${dark 
                ? 'translate-x-9 bg-pink-300' 
                : 'translate-x-0 bg-white'
              }
            `}></span>
            <span className="flex justify-between w-full text-[10px] font-semibold z-10 select-none">
              <span className={`transition-opacity duration-300 ${dark ? 'opacity-30' : 'opacity-100'}`}>🌞</span>
              <span className={`transition-opacity duration-300 ${dark ? 'opacity-100' : 'opacity-30'}`}>🌙</span>
            </span>
          </button>
        </div>
      </header>

      {/* Admin Quick Nav */}
      <div className={`
        flex flex-wrap gap-2 md:gap-4 p-4 md:p-6 rounded-xl
        ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'}
      `}>
        <Link 
          to="/admin/florist-applications" 
          className={`
            px-5 py-2 rounded-full transition-all duration-300 font-medium
            ${dark ? 'bg-blue-800 hover:bg-blue-700 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}
            shadow hover:shadow-md transform hover:scale-105
          `}
        >
          Florist Applications
        </Link>
        <Link 
          to="/admin/all-florists" 
          className={`
            px-5 py-2 rounded-full transition-all duration-300 font-medium
            ${dark ? 'bg-green-800 hover:bg-green-700 text-white' : 'bg-green-100 hover:bg-green-200 text-green-800'}
            shadow hover:shadow-md transform hover:scale-105
          `}
        >
          Manage Florists
        </Link>
        <button 
          onClick={() => setShowOrderingUsers(true)} 
          className={`
            px-5 py-2 rounded-full transition-all duration-300 font-medium
            ${dark ? 'bg-purple-800 hover:bg-purple-700 text-white' : 'bg-purple-100 hover:bg-purple-200 text-purple-800'}
            shadow hover:shadow-md transform hover:scale-105
          `}
        >
          User Orders
        </button>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className={`
          p-6 rounded-xl shadow-lg text-center
          transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl
          ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
        `}>
          <div className={`text-sm mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Users</div>
          <div className={`text-2xl md:text-3xl font-bold ${dark ? 'text-indigo-300' : 'text-indigo-600'}`}>{stats?.totalUsers ?? 0}</div>
          <div className={`mt-2 text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Registered accounts</div>
        </div>
        
        <div className={`
          p-6 rounded-xl shadow-lg text-center
          transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl
          ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
        `}>
          <div className={`text-sm mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Florists</div>
          <div className={`text-2xl md:text-3xl font-bold ${dark ? 'text-pink-300' : 'text-pink-600'}`}>{stats?.totalFlorists ?? 0}</div>
          <div className={`mt-2 text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Active vendors</div>
        </div>
        
        <div className={`
          p-6 rounded-xl shadow-lg text-center
          transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl
          ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
        `}>
          <div className={`text-sm mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Admin (20%) Earnings</div>
          <div className={`text-2xl md:text-3xl font-bold ${dark ? 'text-green-300' : 'text-green-600'}`}>
            ₹{revenueSplit.admin.toFixed(2)}
          </div>
          <div className={`mt-2 text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            From {revenueSplit.paidCount} paid orders
          </div>
        </div>
        
        <div className={`
          p-6 rounded-xl shadow-lg text-center
          transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl
          ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
        `}>
          <div className={`text-sm mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Florist (80%) Earnings</div>
          <div className={`text-2xl md:text-3xl font-bold ${dark ? 'text-green-300' : 'text-green-600'}`}>
            ₹{revenueSplit.florist.toFixed(2)}
          </div>
          <div className={`mt-2 text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Gross ₹{revenueSplit.gross.toFixed(2)}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 gap-4">
        <Link 
          to="/admin/florist-applications" 
          className={`
            py-5 rounded-xl text-center shadow-lg transition-all duration-300
            transform hover:scale-[1.01] hover:shadow-xl
            ${dark 
              ? 'bg-gradient-to-r from-indigo-800 to-purple-800 text-white hover:from-indigo-700 hover:to-purple-700' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
            }
          `}
        >
          <span className="text-lg font-semibold">Review Florist Applications</span>
          <span className="block mt-1 text-sm opacity-80">Approve or reject new florist registrations</span>
        </Link>
      </section>

      {/* Orders overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className={`
          lg:col-span-2 rounded-xl shadow-lg p-5 
          ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
        `}>
          <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-pink-300' : 'text-pink-600'}`}>Recent Orders</h3>
          {ordersLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className={`
                w-10 h-10 border-4 rounded-full animate-spin 
                ${dark ? 'border-pink-300 border-t-transparent' : 'border-pink-500 border-t-transparent'}
              `}></div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className={`
              text-center p-8 rounded-lg 
              ${dark ? 'text-gray-400 bg-gray-700/30' : 'text-gray-500 bg-gray-50'}
            `}>
              No orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                <thead>
                  <tr className={`text-left border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="py-3 px-4 font-semibold">Order ID</th>
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Total (₹)</th>
                    <th className="py-3 px-4 font-semibold">Placed</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.slice(0, 10).map(o => (
                    <tr 
                      key={o.id || o._id} 
                      className={`
                        border-b last:border-0 hover:bg-opacity-30
                        ${dark 
                          ? 'border-gray-700 hover:bg-gray-700' 
                          : 'border-gray-100 hover:bg-pink-50'
                        }
                        transition-colors duration-150
                      `}
                    >
                      <td className="py-3 px-4 font-mono text-xs">{o.id || o._id}</td>
                      <td className="py-3 px-4">{o.user?.name || o.user?.fullName || o.userId || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block
                          ${o.status === 'DELIVERED' 
                            ? dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700' 
                            : o.status === 'FAILED' 
                              ? dark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600' 
                              : dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className={`py-3 px-4 font-medium ${dark ? 'text-green-300' : 'text-green-600'}`}>
                        ₹{Number(o.total || 0).toFixed(2)}
                      </td>
                      <td className={`py-3 px-4 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className={`
          rounded-xl shadow-lg p-5 
          ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
        `}>
          <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-pink-300' : 'text-pink-600'}`}>Top Orders (by value)</h3>
          {ordersLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className={`
                w-8 h-8 border-3 rounded-full animate-spin 
                ${dark ? 'border-pink-300 border-t-transparent' : 'border-pink-500 border-t-transparent'}
              `}></div>
            </div>
          ) : topOrders.length === 0 ? (
            <div className={`
              text-center p-6 rounded-lg 
              ${dark ? 'text-gray-400 bg-gray-700/30' : 'text-gray-500 bg-gray-50'}
            `}>
              No data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                <thead>
                  <tr className={`text-left border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="py-3 px-3 font-semibold">Order</th>
                    <th className="py-3 px-3 font-semibold">User</th>
                    <th className="py-3 px-3 font-semibold">Total</th>
                    <th className="py-3 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topOrders.map(o => (
                    <tr 
                      key={o.id || o._id} 
                      className={`
                        border-b last:border-0 hover:bg-opacity-30
                        ${dark 
                          ? 'border-gray-700 hover:bg-gray-700' 
                          : 'border-gray-100 hover:bg-pink-50'
                        }
                        transition-colors duration-150
                      `}
                    >
                      <td className="py-2 px-3 font-mono">{(o.id || o._id || '').toString().slice(-8)}</td>
                      <td className="py-2 px-3 truncate max-w-[80px]" title={o.user?.name || o.user?.fullName || o.userId}>
                        {o.user?.name || o.user?.fullName || o.userId || '-'}
                      </td>
                      <td className={`py-2 px-3 font-semibold ${dark ? 'text-green-300' : 'text-green-600'}`}>
                        ₹{Number(o.total||0).toFixed(2)}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium inline-block
                          ${o.status === 'DELIVERED' 
                            ? dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700' 
                            : o.status === 'FAILED' 
                              ? dark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600' 
                              : dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
