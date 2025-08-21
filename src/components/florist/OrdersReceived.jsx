import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function OrdersReceived() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/orders/received").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Orders Received</h2>
      {orders.map((o) => (
        <div key={o.id} className="p-4 bg-white shadow rounded-xl mb-4">
          <p>Order ID: {o.id}</p>
          <p>Customer: {o.user.name}</p>
          <p>Status: {o.status}</p>
          <Link to={`/florist/orders/${o.id}`} className="text-blue-500">View Details</Link>
        </div>
      ))}
    </div>
  );
}
