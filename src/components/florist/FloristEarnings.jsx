/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function FloristEarnings() {
  const { user } = useAuth();
  const { dark } = useContext(ThemeContext);
  const floristName = user?.name || user?.fullName || "";
  const floristId = user?.id || user?._id || user?.userId;
  const [earnings, setEarnings] = useState({ gross: 0, share: 0, orders: 0, items: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    
    // Compute earnings from orders
    function compute(orders) {
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
    }
    
    async function load() {
      setLoading(true); setError(null);
      try {
        // Try backend endpoint if it provides florist order earnings directly
        const res = await axios.get("/api/orders/received");
        if (cancelled) return;
        const stats = compute(res.data || []);
        setEarnings(stats);
      } catch (e) {
        // Fallback: scan all local orders:* keys
        try {
          const all = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith("orders:")) {
                try { all.push(...JSON.parse(localStorage.getItem(key) || "[]")); } catch { /* ignore */ }
              }
            }
          if (!cancelled) setEarnings(compute(all));
        } catch(err) {
          if (!cancelled) setError("Unable to load earnings");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [floristId, floristName]);

  return (
    <div className={`
      p-6 sm:p-8 md:p-10 
      rounded-xl shadow-lg transition-all duration-300 ease-in-out
      max-w-md mx-auto text-center space-y-6
      ${dark ? 'bg-gray-800 text-white' : 'bg-gradient-to-br from-pink-50 to-white text-gray-800'}
      transform hover:scale-[1.01] hover:shadow-xl
    `}>
      <h2 className={`
        text-2xl sm:text-3xl font-bold mb-2
        ${dark ? 'text-pink-200' : 'text-pink-600'}
        relative
        after:content-[""] after:absolute after:w-16 after:h-1 
        after:bg-pink-400 after:bottom-[-8px] after:left-1/2 after:transform after:-translate-x-1/2
        after:rounded-full
      `}>My Earnings</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className={`
            w-10 h-10 border-4 rounded-full animate-spin 
            ${dark ? 'border-pink-300 border-t-transparent' : 'border-pink-500 border-t-transparent'}
          `}></div>
        </div>
      ) : error ? (
        <div className={`
          p-4 rounded-lg text-sm
          ${dark ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-600'}
        `}>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 relative py-4">
            <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-500'}`}>Florist Share (80%)</p>
            <p className={`
              text-3xl md:text-4xl font-bold tracking-tight
              ${dark ? 'text-green-300' : 'text-green-600'}
              animate-pulse
            `}>₹{earnings.share.toFixed(2)}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className={`
              rounded-lg p-3 sm:p-4 transition-all duration-300
              ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-pink-50'} 
              shadow-sm hover:shadow transform hover:-translate-y-1
            `}>
              <div className={`${dark ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Gross</div>
              <div className="font-semibold">₹{earnings.gross.toFixed(2)}</div>
            </div>
            
            <div className={`
              rounded-lg p-3 sm:p-4 transition-all duration-300
              ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-pink-50'} 
              shadow-sm hover:shadow transform hover:-translate-y-1
            `}>
              <div className={`${dark ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Orders</div>
              <div className="font-semibold">{earnings.orders}</div>
            </div>
            
            <div className={`
              rounded-lg p-3 sm:p-4 transition-all duration-300
              ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-pink-50'} 
              shadow-sm hover:shadow transform hover:-translate-y-1
            `}>
              <div className={`${dark ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Items</div>
              <div className="font-semibold">{earnings.items}</div>
            </div>
          </div>
          
          <p className={`
            text-xs italic mt-4 px-4
            ${dark ? 'text-gray-400' : 'text-gray-500'}
          `}>
            Includes only PAID→DELIVERED statuses. Platform fee 20% deducted.
          </p>
        </>
      )}
    </div>
  );
}
