import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`/api/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Order Details</h2>
      <p><b>Order ID:</b> {order.id}</p>
      <p><b>Customer:</b> {order.user.name}</p>
      <p><b>Status:</b> {order.status}</p>
      <h3 className="font-semibold mt-4">Products:</h3>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>{item.product.name} - {item.quantity}g</li>
        ))}
      </ul>
    </div>
  );
}
