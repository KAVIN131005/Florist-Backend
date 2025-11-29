import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";

export default function AdminEarnings(){
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async ()=>{
      try {
        const s = await adminService.getPlatformEarnings();
        setStats(s);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading earnings…</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Platform Earnings</h2>
      <div className="bg-white rounded shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Total Platform Earnings</div>
          <div className="text-2xl font-bold">₹{(stats.platformEarnings ?? 0).toFixed(2)}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Total Commission (40%)</div>
          <div className="text-2xl font-bold">₹{(stats.totalCommission ?? 0).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
