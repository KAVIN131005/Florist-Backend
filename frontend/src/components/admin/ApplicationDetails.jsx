import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { useParams, useNavigate } from "react-router-dom";

export default function ApplicationDetails(){
  const { id } = useParams();
  const nav = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async ()=>{
      try {
        const all = await adminService.getFloristApplications();
        const found = (all || []).find(x => String(x.id) === String(id));
        if (!found) { alert("Application not found"); nav("/admin/florist-applications"); return; }
        setApp(found);
      } catch (e){ console.error(e); alert("Failed to load"); nav("/admin/florist-applications"); }
      finally { setLoading(false); }
    })();
  }, [id, nav]);

  if (loading) return <div className="p-6 text-gray-500">Loading…</div>;
  if (!app) return null;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Application Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500">Shop name</div>
          <div className="font-medium">{app.shopName}</div>

          <div className="mt-3 text-sm text-gray-500">Applicant</div>
          <div className="font-medium">{app.applicant?.name} — {app.applicant?.email}</div>

          <div className="mt-3 text-sm text-gray-500">GSTIN</div>
          <div className="font-medium">{app.gstin || "—"}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Description</div>
          <div className="text-sm text-gray-700">{app.description}</div>

          <div className="mt-3 text-sm text-gray-500">Status</div>
          <div className="font-medium">{app.status}</div>

          <div className="mt-4">
            <button onClick={() => { if(confirm("Approve?")) { adminService.approveFlorist(app.id).then(()=>alert("Approved")).catch(()=>alert("Failed")); } }} className="px-3 py-2 bg-green-600 text-white rounded mr-2">Approve</button>
            <button onClick={() => { if(confirm("Reject?")) { adminService.rejectFlorist(app.id).then(()=>alert("Rejected")).catch(()=>alert("Failed")); } }} className="px-3 py-2 bg-red-600 text-white rounded">Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}
