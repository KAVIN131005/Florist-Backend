/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";

export default function FloristApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingFloristApplications();
      setApps(data || []);
    } catch (e) {
      console.error("Error fetching pending applications:", e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    if (!confirm("Approve this application?")) return;
    try {
      await adminService.approveFlorist(id);
      await load();
      alert("Approved");
    // eslint-disable-next-line no-unused-vars
    } catch (e) { alert("Approve failed"); }
  };

  const reject = async (id) => {
    if (!confirm("Reject this application?")) return;
    try {
      await adminService.rejectFlorist(id);
      await load();
      alert("Rejected");
    // eslint-disable-next-line no-unused-vars
    } catch (e) { alert("Reject failed"); }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading applications…</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Florist Applications</h2>
      {apps.length === 0 ? (
        <div className="text-gray-600">No pending applications.</div>
      ) : (
        <div className="grid gap-4">
          {apps.map(a => (
            <div key={a.id} className="bg-white rounded-lg shadow p-4 flex items-start justify-between">
              <div>
                <div className="font-semibold text-lg">{a.shopName || a.applicant?.name}</div>
                <div className="text-sm text-gray-600">{a.description}</div>
                <div className="text-xs text-gray-400 mt-1">Status: <span className="font-medium">{a.status}</span></div>
              </div>
              <div className="flex flex-col gap-2">
                  <button onClick={() => nav(`/admin/florists/${a.id}`)} className="px-3 py-1 border rounded">View</button>
                <button onClick={() => approve(a.id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                <button onClick={() => reject(a.id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
