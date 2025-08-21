import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/api/orders/${id}`, { withCredentials: true })
      .then(res => setOrder(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Order Tracking</h1>
      <div className="bg-white shadow p-4 rounded-xl">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ₹{order.total}</p>
        <p><strong>Items:</strong></p>
        <ul className="list-disc pl-5">
          {order.items.map(i => (
            <li key={i.id}>{i.product.name} - {i.quantity} x ₹{i.product.price}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
