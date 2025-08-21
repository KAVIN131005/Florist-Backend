import React, { useEffect, useState } from "react";

import api from "../../services/api";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/api/orders/my", { withCredentials: true })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>
      {orders.map(order => (
        <div key={order.id} className="bg-white shadow p-4 rounded-xl mb-4">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <Link to={`/orders/${order.id}`} className="text-blue-600">Track Order</Link>
        </div>
      ))}
    </div>
  );
}
