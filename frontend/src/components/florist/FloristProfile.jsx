import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FloristProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/api/user/me").then((res) => setUser(res.data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-xl max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.roles.join(", ")}</p>
    </div>
  );
}
