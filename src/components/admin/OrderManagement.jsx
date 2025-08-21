import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { useParams } from "react-router-dom";

export default function OrderManagement(){
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async ()=>{
      setLoading(true);
      try {
        const o = await adminService.getOrder(id);
        setOrder(o);
      } catch (e){ console.error(e); }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading order…</div>;
  if (!order) return <div className="p-6 text-red-600">Order not found</div>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Order #{order.id}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div><strong>User:</strong> {order.user?.name} ({order.user?.email})</div>
          <div className="mt-2"><strong>Status:</strong> {order.status}</div>
          <div className="mt-2"><strong>Total:</strong> ₹{order.totalAmount?.toFixed(2)}</div>
        </div>
        <div>
          <h3 className="font-semibold">Items</h3>
          <ul className="mt-2 space-y-2">
            {order.items.map(it => (
              <li key={it.productId} className="flex justify-between">
                <div>{it.productName} — {it.grams}g</div>
                <div>₹{it.subtotal?.toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 space-x-2">
        <button onClick={() => adminService.updateOrderStatus(order.id, 'SHIPPED').then(()=>window.location.reload())} className="px-3 py-2 bg-yellow-500 rounded text-white">Ship</button>
        <button onClick={() => adminService.updateOrderStatus(order.id, 'DELIVERED').then(()=>window.location.reload())} className="px-3 py-2 bg-green-600 rounded text-white">Deliver</button>
      </div>
    </div>
  );
}
