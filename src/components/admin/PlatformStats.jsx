import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";

export default function PlatformStats(){
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async ()=>{
      try {
        const s = await adminService.getPlatformEarnings(); // reuse same endpoint
        setStats(s);
      } catch (e) { console.error(e); }
    })();
  }, []);

  if (!stats) return <div className="p-6 text-gray-500">Loading stats…</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Platform Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{stats.totalUsers ?? '—'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className="text-2xl font-bold">{stats.totalOrders ?? '—'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Active Florists</div>
          <div className="text-2xl font-bold">{stats.totalFlorists ?? '—'}</div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Revenue</h3>
        <div className="mt-2 text-2xl font-bold">₹{(stats.platformEarnings ?? 0).toFixed(2)}</div>
      </div>
    </div>
  );
}
