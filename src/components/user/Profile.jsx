import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios; // If using axios directly, or import your custom API client instead



export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/api/user/me", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <div className="bg-white p-4 rounded-xl shadow">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.roles?.join(", ")}</p>
      </div>
    </div>
  );
}
