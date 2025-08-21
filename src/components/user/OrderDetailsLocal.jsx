import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import orderService, { LOCAL_ORDER_STATUSES } from "../../services/orderService";

export default function OrderDetailsLocal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || user?._id || user?.userId;
  const [order, setOrder] = useState(null);
  const [autoProgress, setAutoProgress] = useState(true);
  const intervalRef = useRef(null);

  // Define linear progression stages (exclude user-triggered terminal ones)
  const progressionStages = ["CREATED", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

  useEffect(() => {
    const o = orderService.getLocalOrder(userId, id);
    if (!o) return; // silently
    setOrder(o);
  }, [id, userId]);
  const advance = () => {
    const updated = orderService.advanceLocalOrderStatus(userId, order.id);
    if (updated) setOrder({ ...updated });
  };

  const manualSet = (e) => {
    const updated = orderService.updateLocalOrderStatus(userId, order.id, e.target.value);
    if (updated) setOrder({ ...updated });
  };

  // Auto progression every 5 seconds with tick updates until terminal or disabled
  useEffect(() => {
    // Always clear previous
    if (intervalRef.current) clearInterval(intervalRef.current);
    const shouldRun = order && autoProgress && !["DELIVERED", "CANCELLED", "FAILED"].includes(order.status);
    if (!shouldRun) return;
    intervalRef.current = setInterval(() => {
      setOrder(prev => {
        if (!prev) return prev;
        if (["DELIVERED", "CANCELLED", "FAILED"].includes(prev.status)) return prev;
        const updated = orderService.advanceLocalOrderStatus(userId, prev.id);
        return updated ? { ...updated } : prev;
      });
  }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [order, autoProgress, userId]);

  const currentIndex = order ? progressionStages.indexOf(order.status) : -1;
  const progressPercent = currentIndex <= 0 ? 0 : (currentIndex / (progressionStages.length - 1)) * 100;

  if (!order) {
    return (
      <div className="p-6">
        <div className="mb-4">Order not found locally.</div>
        <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
      <div className="bg-white shadow rounded p-4 mb-6">
        <p><strong>Status:</strong> <span className="font-semibold">{order.status}</span></p>
        <p><strong>Total:</strong> ₹{order.total}</p>
        <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Updated:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
        <div className="mt-4 flex gap-2 flex-wrap">
          <button onClick={advance} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Advance Status</button>
          <select onChange={manualSet} value={order.status} className="border rounded px-2 py-1 text-sm">
            {LOCAL_ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={() => setAutoProgress(a => !a)}
            className={`px-3 py-1 rounded text-sm ${autoProgress ? "bg-orange-500 text-white" : "bg-gray-300"}`}
          >
            {autoProgress ? "Pause Auto" : "Resume Auto"}
          </button>
          <button onClick={() => navigate(-1)} className="px-3 py-1 bg-gray-200 rounded text-sm">Back</button>
        </div>
      </div>

      {/* Visual timeline */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Live Timeline</h2>
        <div className="relative mb-4">
          <div className="h-1 bg-gray-300 rounded" />
          <div className="h-1 bg-green-500 rounded absolute top-0 left-0 transition-all duration-700" style={{ width: `${progressPercent}%` }} />
          <div className="absolute inset-0 flex justify-between">
            {progressionStages.map((stage, idx) => {
              const reached = progressionStages.indexOf(order.status) >= idx;
              return (
                <div key={stage} className="flex flex-col items-center -translate-x-1/2" style={{ left: `${(idx/(progressionStages.length-1))*100}%` }}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-500 ${reached ? "bg-green-500 border-green-600 text-white" : "bg-white border-gray-400 text-gray-400"}`}>
                    {reached ? "✓" : idx+1}
                  </div>
                  <span className="mt-1 text-[10px] tracking-wide text-center w-14 leading-tight">{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
  {/* Removed auto-update explanatory text per request */}
      </div>

      <h2 className="text-lg font-semibold mb-2">Items</h2>
      <ul className="space-y-2 mb-6">
        {order.items.map(it => (
          <li key={it.id} className="bg-white shadow rounded p-3 flex justify-between">
            <span>{it.name} x {it.quantity}</span>
            <span>₹{it.price * it.quantity}</span>
          </li>
        ))}
      </ul>

  {/* Status log removed as requested */}
    </div>
  );
}
