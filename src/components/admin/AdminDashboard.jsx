import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Fetch platform stats from backend
        const s = await adminService.getPlatformStats();
        setStats({
          platformEarnings: s?.platformEarnings1 ?? 0,
          totalUsers: s?.totalUsers1 ?? 0,
          totalOrders: s?.totalOrders1 ?? 0,
          totalFlorists: s?.totalFlorists1 ?? 0
        });
      } catch (e) {
        console.error("Error fetching dashboard stats: ", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading dashboard…</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <Link to="/admin/florist-applications" className="px-3 py-1 bg-blue-600 text-white rounded">Florist Apps</Link>
          <Link to="/admin/all-florists" className="px-3 py-1 bg-green-600 text-white rounded">Florists</Link>
          <Link to="/admin/orders" className="px-3 py-1 bg-purple-600 text-white rounded">Orders</Link>
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
          <div className="text-sm text-gray-500">Orders</div>
          <div className="text-2xl font-bold">{stats?.totalOrders ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-sm text-gray-500">Platform Earnings</div>
          <div className="text-2xl font-bold">₹{Number(stats?.platformEarnings ?? 0).toFixed(2)}</div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/florist-applications" className="bg-indigo-600 text-white py-4 rounded text-center shadow hover:opacity-95">Review Applications</Link>
        <Link to="/admin/categories" className="bg-yellow-500 text-white py-4 rounded text-center shadow hover:opacity-95">Manage Categories</Link>
        <Link to="/admin/earnings" className="bg-emerald-600 text-white py-4 rounded text-center shadow hover:opacity-95">View Earnings</Link>
      </section>
    </div>
  );
}
