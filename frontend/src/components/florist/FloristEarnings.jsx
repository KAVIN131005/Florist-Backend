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
  const [earnings, setEarnings] = useState({ 
    gross: 0, 
    share: 0, 
    orders: 0, 
    items: 0,
    monthly: 0,
    weekly: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    let cancelled = false;
    
    // Compute earnings from orders
    function compute(orders, timeFilter = 'all') {
      const paidStatuses = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];
      let gross = 0; 
      let ordersCount = 0; 
      let itemCount = 0;
      let monthly = 0;
      let weekly = 0;
      
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      orders.forEach(o => {
        if (!paidStatuses.includes(o.status)) return;
        
        const orderDate = new Date(o.createdAt || o.date || 0);
        
        const relevantItems = (o.items || []).filter(it =>
          (it.floristId && floristId && String(it.floristId) === String(floristId)) ||
          (it.floristName && floristName && it.floristName.toLowerCase() === floristName.toLowerCase())
        );
        
        if (relevantItems.length === 0) return;
        
        const orderTotal = relevantItems.reduce((sum, it) => {
          const subtotal = Number(it.price) * Number(it.quantity || 0);
          return isNaN(subtotal) ? sum : sum + subtotal;
        }, 0);
        
        const orderItemCount = relevantItems.reduce((sum, it) => sum + Number(it.quantity || 0), 0);
        
        if (timeFilter === 'all' || 
            (timeFilter === 'monthly' && orderDate >= monthAgo) ||
            (timeFilter === 'weekly' && orderDate >= weekAgo)) {
          gross += orderTotal;
          itemCount += orderItemCount;
          ordersCount += 1;
        }
        
        if (orderDate >= monthAgo) monthly += orderTotal;
        if (orderDate >= weekAgo) weekly += orderTotal;
      });
      
      const share = gross * 0.80; // florist share after 20% platform fee
      return { 
        gross, 
        share, 
        orders: ordersCount, 
        items: itemCount,
        monthly: monthly * 0.80,
        weekly: weekly * 0.80
      };
    }
    
    async function load() {
      setLoading(true); 
      setError(null);
      
      try {
        const res = await axios.get("/api/orders/received");
        if (cancelled) return;
        const stats = compute(res.data || [], timeframe);
        setEarnings(stats);
      } catch (e) {
        try {
          const all = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("orders:")) {
              try { 
                all.push(...JSON.parse(localStorage.getItem(key) || "[]")); 
              } catch { /* ignore */ }
            }
          }
          if (!cancelled) {
            const stats = compute(all, timeframe);
            setEarnings(stats);
          }
        } catch(err) {
          if (!cancelled) setError("Unable to load earnings data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    load();
    return () => { cancelled = true; };
  }, [floristId, floristName, timeframe]);

  if (loading) return (
    <div className={`min-h-screen flex justify-center items-center ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'}`}>
      <div className="text-center">
        <div className="relative mb-8">
          <div className={`w-20 h-20 rounded-full border-4 border-t-transparent animate-spin ${dark ? 'border-green-400' : 'border-green-500'}`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-ping">💰</span>
          </div>
        </div>
        <p className={`text-xl font-semibold ${dark ? 'text-green-300' : 'text-green-600'} animate-pulse`}>
          Loading Earnings...
        </p>
      </div>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen flex justify-center items-center ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'}`}>
      <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl p-12 text-center`}>
        <div className="text-6xl mb-6 animate-bounce">❌</div>
        <h3 className={`text-2xl font-bold ${dark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
          Error Loading Earnings
        </h3>
        <p className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          {error}
        </p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'}`}>
      {/* Enhanced Header Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="relative">
              <div className="text-7xl animate-bounce transform hover:scale-110 transition-transform duration-300">💰</div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">📊</div>
            <div className="relative">
              <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">🌱</div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <h1 className={`text-5xl md:text-6xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-6 relative`}>
              <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent animate-gradient-x">
                My Earnings
              </span>
            </h1>
            <div className="w-32 h-1 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse"></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-8 font-medium`}>
            🌿 Track your floral business financial performance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Primary Earnings Card */}
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 animate-gradient-x"></div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-bounce">💎</div>
              <h3 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Total Florist Share
              </h3>
              <p className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                After 20% platform fee deduction
              </p>
            </div>
            
            <div className="text-center mb-8">
              <div className={`
                text-6xl md:text-7xl font-bold tracking-tight mb-4
                ${dark ? 'text-green-300' : 'text-green-600'}
                animate-pulse
              `}>
                ₹{earnings.share.toFixed(2)}
              </div>
              
              <div className="flex justify-center gap-4 text-sm">
                <span className={`px-3 py-1 rounded-full ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  Gross: ₹{earnings.gross.toFixed(2)}
                </span>
                <span className={`px-3 py-1 rounded-full ${dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
                  Platform Fee: 20%
                </span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`
                p-6 rounded-2xl text-center transition-all duration-300
                ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg'} 
                transform hover:-translate-y-1
              `}>
                <div className="text-3xl mb-3 animate-pulse">📦</div>
                <div className={`text-2xl font-bold mb-1 ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {earnings.orders}
                </div>
                <div className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Orders
                </div>
              </div>
              
              <div className={`
                p-6 rounded-2xl text-center transition-all duration-300
                ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg'} 
                transform hover:-translate-y-1
              `}>
                <div className="text-3xl mb-3 animate-pulse">🌸</div>
                <div className={`text-2xl font-bold mb-1 ${dark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {earnings.items}
                </div>
                <div className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Items Sold
                </div>
              </div>
              
              <div className={`
                p-6 rounded-2xl text-center transition-all duration-300
                ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-br from-emerald-50 to-green-50 hover:shadow-lg'} 
                transform hover:-translate-y-1
              `}>
                <div className="text-3xl mb-3 animate-pulse">📈</div>
                <div className={`text-2xl font-bold mb-1 ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  ₹{earnings.orders > 0 ? (earnings.share / earnings.orders).toFixed(0) : '0'}
                </div>
                <div className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Avg per Order
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time-based Earnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Monthly Earnings */}
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 animate-gradient-x"></div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3 animate-bounce">📅</div>
                <h4 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Last 30 Days
                </h4>
                <div className={`text-3xl font-bold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
                  ₹{earnings.monthly.toFixed(2)}
                </div>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                  Monthly earnings
                </p>
              </div>
            </div>
          </div>
          
          {/* Weekly Earnings */}
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 animate-gradient-x"></div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3 animate-bounce">🗓️</div>
                <h4 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Last 7 Days
                </h4>
                <div className={`text-3xl font-bold ${dark ? 'text-purple-400' : 'text-purple-600'}`}>
                  ₹{earnings.weekly.toFixed(2)}
                </div>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                  Weekly earnings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 animate-gradient-x"></div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4 animate-bounce">💡</div>
              <h3 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Earnings Breakdown
              </h3>
              <p className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                Understanding your revenue streams
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Revenue Structure */}
              <div className="space-y-4">
                <h4 className={`font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'} text-center mb-6`}>
                  Revenue Distribution
                </h4>
                
                <div className={`p-4 rounded-2xl ${dark ? 'bg-gray-700' : 'bg-gradient-to-r from-green-50 to-emerald-50'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${dark ? 'text-green-400' : 'text-green-600'}`}>
                      🌸 Your Share (80%)
                    </span>
                    <span className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      ₹{earnings.share.toFixed(2)}
                    </span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${dark ? 'bg-gray-600' : ''}`}>
                    <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-2xl ${dark ? 'bg-gray-700' : 'bg-gradient-to-r from-gray-50 to-slate-50'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      🏢 Platform Fee (20%)
                    </span>
                    <span className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      ₹{(earnings.gross - earnings.share).toFixed(2)}
                    </span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${dark ? 'bg-gray-600' : ''}`}>
                    <div className="bg-gradient-to-r from-gray-400 to-slate-400 h-2 rounded-full" style={{width: '20%'}}></div>
                  </div>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className={`font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'} text-center mb-6`}>
                  Performance Insights
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl text-center ${dark ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-cyan-50'}`}>
                    <div className="text-2xl mb-2">🎯</div>
                    <div className={`text-lg font-bold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {earnings.items > 0 ? ((earnings.share / earnings.items) * 100).toFixed(0) : '0'}%
                    </div>
                    <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Profit Margin
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-2xl text-center ${dark ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50'}`}>
                    <div className="text-2xl mb-2">⭐</div>
                    <div className={`text-lg font-bold ${dark ? 'text-purple-400' : 'text-purple-600'}`}>
                      {earnings.orders > 0 ? (earnings.items / earnings.orders).toFixed(1) : '0'}
                    </div>
                    <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Items per Order
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-2xl text-center ${dark ? 'bg-gray-700' : 'bg-gradient-to-br from-emerald-50 to-green-50'}`}>
                    <div className="text-2xl mb-2">💎</div>
                    <div className={`text-lg font-bold ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      ₹{earnings.items > 0 ? (earnings.share / earnings.items).toFixed(0) : '0'}
                    </div>
                    <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Revenue per Item
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-2xl text-center ${dark ? 'bg-gray-700' : 'bg-gradient-to-br from-yellow-50 to-orange-50'}`}>
                    <div className="text-2xl mb-2">🚀</div>
                    <div className={`text-lg font-bold ${dark ? 'text-orange-400' : 'text-orange-600'}`}>
                      {(earnings.weekly * 52).toFixed(0)}
                    </div>
                    <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Projected Annual
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className={`text-center p-6 rounded-2xl ${dark ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
          <p className={`text-sm italic ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            💡 Earnings include only orders with PAID → DELIVERED status. Platform fee of 20% is automatically deducted.
          </p>
        </div>
      </div>
    </div>
  );
}
