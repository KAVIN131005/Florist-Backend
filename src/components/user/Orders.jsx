import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import orderService from "../../services/orderService";
import { useAuth } from "../../hooks/useAuth";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const userId = user?.id || user?._id || user?.userId;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // If we have a logged in user try backend, else just read guest/local
      if (userId) {
        try {
          const res = await api.get("/api/orders/my", { withCredentials: true });
          if (!cancelled) setOrders(res.data || []);
          return;
        } catch {
          // fall through to local
        }
      }
      const local = orderService.getLocalOrders(userId); // userId may be undefined -> guest key logic inside service
      if (!cancelled) setOrders(local);
    };
    load();
    return () => { cancelled = true; };
  }, [userId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>
      {!userId && (
        <p className="text-xs text-gray-500 mb-4">Viewing local orders (not signed in).</p>
      )}
      {orders.length === 0 && (
        <div className="text-gray-500">No orders yet.</div>
      )}
      {orders.map(order => (
        <div key={order.id} className="bg-white shadow p-4 rounded-xl mb-4">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
          <p><strong>Status:</strong> {order.status}</p>
          {order.items && (
            <ul className="mt-2 text-sm list-disc list-inside space-y-1">
              {order.items.map(it => (
                <li key={it.id}>{it.name} x {it.quantity} = ₹{it.price * it.quantity}</li>
              ))}
            </ul>
          )}
          <Link to={`/orders/${order.id}`} className="text-blue-600">Track Order</Link>
        </div>
      ))}
    </div>
  );
}
