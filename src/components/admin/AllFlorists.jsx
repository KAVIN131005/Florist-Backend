import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";

export default function AllFlorists(){
  const [florists, setFlorists] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const users = await adminService.getUsers();
      const fs = (users || []).filter(u => (u.roles || []).includes("FLORIST"));
      setFlorists(fs);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading florists…</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Florists</h2>
      <div className="grid gap-4">
        {florists.map(f => (
          <div key={f.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">{f.name}</div>
              <div className="text-sm text-gray-500">{f.email}</div>
            </div>
            <div className="space-x-2">
          
              <button onClick={() => { if(confirm('Delete user?')) adminService.deleteUser(f.id).then(()=>load()).catch(()=>alert('Delete failed')); }} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
        {florists.length === 0 && <div className="text-gray-600">No florists found.</div>}
      </div>
    </div>
  );
}
