import React, { useState } from "react";
import api from "../../services/api";

export default function BecomeFlorist() {
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");
  const [gstin, setGstin] = useState("");

  const submitApplication = (e) => {
    e.preventDefault();
    api.post(
      "/florist/apply",
      { shopName, description, gstNumber: gstin }, // ✅ match backend DTO
      { withCredentials: true }
    )
      .then(() => setMsg("Application submitted successfully"))
      .catch(err =>
        setMsg(err.response?.data?.message || "Error submitting application")
      );
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Become a Florist</h1>
      <form onSubmit={submitApplication} className="bg-white shadow p-4 rounded-xl space-y-4">
        <input
          type="text"
          placeholder="Shop Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="GSTIN"
          value={gstin}
          onChange={(e) => setGstin(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      {msg && <p className="mt-3 text-blue-600">{msg}</p>}
    </div>
  );
}
