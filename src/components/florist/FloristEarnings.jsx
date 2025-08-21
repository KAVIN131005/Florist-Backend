import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

export default function FloristEarnings() {
  const { user } = useAuth();
  const floristName = user?.name || user?.fullName || "";
  const floristId = user?.id || user?._id || user?.userId;
  const [earnings, setEarnings] = useState({ gross: 0, share: 0, orders: 0, items: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const compute = useCallback((orders) => {
    const paidStatuses = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"]; // credited statuses
    let gross = 0; let ordersCount = 0; let itemCount = 0;
    orders.forEach(o => {
      if (!paidStatuses.includes(o.status)) return;
      const relevantItems = (o.items || []).filter(it =>
        (it.floristId && floristId && String(it.floristId) === String(floristId)) ||
        (it.floristName && floristName && it.floristName.toLowerCase() === floristName.toLowerCase())
      );
      if (relevantItems.length === 0) return;
      ordersCount += 1;
      relevantItems.forEach(it => {
        const subtotal = Number(it.price) * Number(it.quantity || 0);
        if (!isNaN(subtotal)) gross += subtotal;
        itemCount += Number(it.quantity || 0);
      });
    });
    const share = gross * 0.80; // florist share after 20% platform fee
    return { gross, share, orders: ordersCount, items: itemCount };
  }, [floristId, floristName]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError(null);
      try {
        const res = await axios.get("/api/orders/received");
        if (cancelled) return;
        setEarnings(compute(res.data || []));
      } catch {
        try {
          const all = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("orders:")) {
              try { all.push(...JSON.parse(localStorage.getItem(key) || "[]")); } catch { /* ignore */ }
            }
          }
          if (!cancelled) setEarnings(compute(all));
        } catch {
          if (!cancelled) setError("Unable to load earnings");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [compute]);

  return (
    <div className="p-6 bg-white shadow rounded-xl max-w-md mx-auto text-center space-y-4">
      <h2 className="text-2xl font-bold">My Earnings</h2>
      {loading ? <p className="text-gray-500">Calculating…</p> : error ? <p className="text-red-600 text-sm">{error}</p> : (
        <>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Florist Share (80%)</p>
            <p className="text-green-600 text-3xl font-bold">₹{earnings.share.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-gray-50 rounded p-2">
              <div className="text-gray-500">Gross</div>
              <div className="font-semibold">₹{earnings.gross.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="text-gray-500">Orders</div>
              <div className="font-semibold">{earnings.orders}</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="text-gray-500">Items</div>
              <div className="font-semibold">{earnings.items}</div>
            </div>
          </div>
          <p className="text-[11px] text-gray-400">Includes only PAID→DELIVERED statuses. Platform fee 20% deducted.</p>
        </>
      )}
    </div>
  );
}
