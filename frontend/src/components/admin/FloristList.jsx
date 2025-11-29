import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";

export default function FloristList(){
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async ()=>{
      setLoading(true);
      try {
        const users = await adminService.getUsers();
        setList((users || []).filter(u => (u.roles || []).includes("FLORIST")));
      } catch (e){ console.error(e); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading…</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Florist List</h2>
      <div className="grid gap-3">
        {list.map(f => (
          <div key={f.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{f.name}</div>
              <div className="text-sm text-gray-500">{f.email}</div>
            </div>
            <div>
              <button onClick={() => alert('Open florist profile (not implemented)')} className="px-3 py-1 border rounded">Profile</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="text-gray-600">No florists yet.</div>}
      </div>
    </div>
  );
}
