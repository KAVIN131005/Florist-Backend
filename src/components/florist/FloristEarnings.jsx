import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FloristEarnings() {
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    axios.get("/api/wallet/balance").then((res) => setEarnings(res.data.message));
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded-xl max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">My Earnings</h2>
      <p className="text-green-600 text-3xl font-bold">₹{earnings}</p>
    </div>
  );
}
