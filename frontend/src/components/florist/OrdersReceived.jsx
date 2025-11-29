import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

export default function OrdersReceived() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const floristName = user?.name || user?.fullName || "";
  const floristId = user?.id || user?._id || user?.userId;

  useEffect(() => {
    let cancelled = false;
    axios.get("/api/orders/received")
      .then(res => { if (!cancelled) setOrders(res.data || []); })
      .catch(() => {
        // fallback: aggregate from all local user orders (not ideal but for demo)
        // We'll scan every local orders:* key in localStorage
        const localOrders = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
            if (key && key.startsWith("orders:")) {
              try {
                const arr = JSON.parse(localStorage.getItem(key) || "[]");
                localOrders.push(...arr);
              } catch { /* ignore */ }
            }
        }
        if (!cancelled) setOrders(localOrders);
      });
    return () => { cancelled = true; };
  }, []);

  // Filter each order's items to only those belonging to this florist
  const filtered = orders.map(o => ({
    ...o,
    floristItems: (o.items || []).filter(it =>
      (it.floristId && floristId && String(it.floristId) === String(floristId)) ||
      (it.floristName && floristName && it.floristName.toLowerCase() === floristName.toLowerCase())
    ),
  })).filter(o => o.floristItems.length > 0);

  // Aggregate totals per product for quick view
  const aggregatePerOrder = (o) => o.floristItems.map(it => ({
    id: it.id,
    name: it.name,
    quantity: it.quantity,
    total: it.price * it.quantity,
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Orders Received</h2>
      {filtered.length === 0 && (
        <div className="text-gray-500">No orders contain your products yet.</div>
      )}
      {filtered.map((o) => {
        const orderId = o.id || o._id || o.orderId || "";
        return (
        <div key={orderId} className="p-4 bg-white shadow rounded-xl mb-4">
          <p className="font-semibold">Order ID: <span className="font-mono text-sm">{orderId}</span></p>
          {o.user?.name && <p>Customer: {o.user.name}</p>}
          <p>Status: {o.status}</p>
          <div className="mt-2">
            <p className="font-medium mb-1 text-sm">Your Items:</p>
            <ul className="text-sm list-disc list-inside space-y-1">
              {aggregatePerOrder(o).map(it => (
                <li key={it.id}>{it.name} x {it.quantity} (₹{it.total})</li>
              ))}
            </ul>
          </div>
          <Link to={`/florist/orders/${orderId}`} className="text-blue-500 text-sm mt-2 inline-block">View Details</Link>
        </div>
      );})}
    </div>
  );
}
