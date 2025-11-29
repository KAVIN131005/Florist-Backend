import React, { useEffect, useState } from "react";

import api from "../../services/api";

export default function ApplicationStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get("/api/florists/status", { withCredentials: true })
      .then(res => setStatus(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!status) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Florist Application Status</h1>
      <div className="bg-white shadow p-4 rounded-xl">
        <p><strong>Status:</strong> {status.approved ? "Approved" : "Pending"}</p>
        <p><strong>Shop:</strong> {status.shopName}</p>
        <p><strong>Description:</strong> {status.description}</p>
      </div>
    </div>
  );
}
