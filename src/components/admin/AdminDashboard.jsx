import React, { useEffect, useState, useMemo } from "react";
import adminService from "../../services/adminService";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
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
        console.error("Error fetching dashboard stats: ", e);
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
        } else {
          // Treat empty list as possible backend placeholder -> fallback to local scan
          const localOrders = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("orders:")) {
              try { localOrders.push(...JSON.parse(localStorage.getItem(key) || "[]")); } catch { /* ignore parse error */ }
            }
          }
          setOrders(localOrders);
        }
      })
      .catch(err => {
        console.warn("Backend orders fetch failed, using local fallback", err);
        const localOrders = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("orders:")) {
            try { localOrders.push(...JSON.parse(localStorage.getItem(key) || "[]")); } catch { /* ignore parse error */ }
          }
        }
        if (!cancelled) setOrders(localOrders);
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
      <div className="p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users Who Placed Orders</h1>
          <button onClick={() => setShowOrderingUsers(false)} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Back</button>
        </header>
        <div className="bg-white rounded shadow p-4">
          {ordersLoading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : ordersByUser.length === 0 ? (
            <div className="text-sm text-gray-500">No users have placed orders yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-2">User</th>
                  <th className="py-2 pr-2">Orders</th>
                  <th className="py-2 pr-2">Total ₹</th>
                </tr>
              </thead>
              <tbody>
                {ordersByUser.map(u => (
                  <tr key={u.userId} className="border-b last:border-0">
                    <td className="py-2 pr-2">{u.name}</td>
                    <td className="py-2 pr-2">{u.count}</td>
                    <td className="py-2 pr-2">{u.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <Link to="/admin/florist-applications" className="px-3 py-1 bg-blue-600 text-white rounded">Florist Apps</Link>
          <Link to="/admin/all-florists" className="px-3 py-1 bg-green-600 text-white rounded">Florists</Link>
          <button onClick={() => setShowOrderingUsers(true)} className="px-3 py-1 bg-purple-600 text-white rounded">Orders</button>
        </div>
      </header>

      {/* Stats Cards */}
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-sm text-gray-500">Users</div>
          <div className="text-2xl font-bold">{stats?.totalUsers ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-sm text-gray-500">Florists</div>
          <div className="text-2xl font-bold">{stats?.totalFlorists ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
      <div className="text-sm text-gray-500">Admin (20%) Earnings</div>
      <div className="text-2xl font-bold">₹{revenueSplit.admin.toFixed(2)}</div>
      <div className="text-[10px] text-gray-400 mt-1">From {revenueSplit.paidCount} paid orders</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
      <div className="text-sm text-gray-500">Florist (80%) Earnings</div>
      <div className="text-2xl font-bold">₹{revenueSplit.florist.toFixed(2)}</div>
      <div className="text-[10px] text-gray-400 mt-1">Gross ₹{revenueSplit.gross.toFixed(2)}</div>
        </div>
      </section>

      {/* Quick Links (earnings link removed) */}
      <section className="grid grid-cols-1 gap-4">
        <Link to="/admin/florist-applications" className="bg-indigo-600 text-white py-4 rounded text-center shadow hover:opacity-95">Review Applications</Link>
      </section>

      {/* Orders overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-3">Recent Orders</h3>
          {ordersLoading ? (
            <div className="text-sm text-gray-500">Loading orders…</div>
          ) : recentOrders.length === 0 ? (
            <div className="text-sm text-gray-500">No orders yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-2">Order ID</th>
                  <th className="py-2 pr-2">User</th>
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2 pr-2">Total (₹)</th>
                  <th className="py-2 pr-2">Placed</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 10).map(o => (
                  <tr key={o.id || o._id} className="border-b last:border-0">
                    <td className="py-2 pr-2 font-mono text-xs">{o.id || o._id}</td>
                    <td className="py-2 pr-2">{o.user?.name || o.user?.fullName || o.userId || '-'}</td>
                    <td className="py-2 pr-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : o.status === 'FAILED' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-700'}`}>{o.status}</span>
                    </td>
                    <td className="py-2 pr-2">{Number(o.total || 0).toFixed(2)}</td>
                    <td className="py-2 pr-2 text-xs text-gray-500">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-3">Top Orders (by value)</h3>
          {ordersLoading ? <div className="text-sm text-gray-500">Loading…</div> : topOrders.length === 0 ? <div className="text-sm text-gray-500">No data.</div> : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1 pr-2">Order</th>
                  <th className="py-1 pr-2">User</th>
                  <th className="py-1 pr-2">Total</th>
                  <th className="py-1 pr-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {topOrders.map(o => (
                  <tr key={o.id || o._id} className="border-b last:border-0">
                    <td className="py-1 pr-2 font-mono">{(o.id || o._id || '').toString().slice(-8)}</td>
                    <td className="py-1 pr-2 truncate max-w-[80px]" title={o.user?.name || o.user?.fullName || o.userId}>{o.user?.name || o.user?.fullName || o.userId || '-'}</td>
                    <td className="py-1 pr-2 font-semibold">₹{Number(o.total||0).toFixed(2)}</td>
                    <td className="py-1 pr-2"><span className={`px-1.5 py-0.5 rounded text-[10px] ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : o.status === 'FAILED' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-700'}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
