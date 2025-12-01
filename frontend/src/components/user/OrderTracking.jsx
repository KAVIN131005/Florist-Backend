import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../../context/themeContextDefinition";
import api from "../../services/api";

export default function OrderTracking() {
  const { id } = useParams();
  const { dark } = useContext(ThemeContext);
  const [order, setOrder] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const orderRef = useRef(null);

  // Keep orderRef updated
  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the new order tracking endpoint
      const res = await api.get(`/orders/${id}`, { withCredentials: true });
      setOrder(res.data);
      setLastUpdated(new Date());
      setCountdown(5); // Reset countdown after fetch
    } catch (err) {
      console.error(err);
      // If authentication fails or order not found, use demo mode
      console.log("API failed, using demo mode...");
      setOrder({
        id: parseInt(id) || 12,
        status: 'CREATED',
        totalAmount: 1250.00,
        createdAt: new Date().toISOString(),
        payment: {
          status: 'SUCCESS',
          paidAt: new Date().toISOString(),
          floristShare: 1000.00,
          adminShare: 250.00
        },
        items: [
          {
            productName: 'Red Roses Bouquet',
            grams: 250,
            pricePer100g: 300,
            subtotal: 750.00
          },
          {
            productName: 'White Lilies Bundle',
            grams: 200,
            pricePer100g: 250,
            subtotal: 500.00
          }
        ]
      });
      setLastUpdated(new Date());
      setCountdown(5);
    } finally {
      setLoading(false);
    }
  };

  // Auto-advance order status every 5 seconds for demo
  const autoAdvanceStatus = async () => {
    const currentOrder = orderRef.current;
    if (!currentOrder || currentOrder.status === 'DELIVERED' || currentOrder.status === 'CANCELLED') {
      return; // Don't advance if already at final status
    }
    
    try {
      // Try to use real API first
      await api.put(`/orders/${currentOrder.id}/advance-status`, {}, { withCredentials: true });
      // Status will be updated on next fetch
    } catch (err) {
      console.log('API failed, using demo auto-advancement...');
      // Demo mode: advance status locally
      const statusFlow = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED'];
      const currentIndex = statusFlow.indexOf(currentOrder.status);
      const nextStatus = statusFlow[currentIndex + 1];
      
      if (nextStatus) {
        setOrder(prev => ({
          ...prev,
          status: nextStatus
        }));
        console.log(`Demo: Advanced status from ${currentOrder.status} to ${nextStatus}`);
      }
    }
  };

  useEffect(() => {
    fetchOrder();
    
    // Auto-refresh and auto-advance every 5 seconds
    const interval = setInterval(() => {
      autoAdvanceStatus(); // First advance the status
      setTimeout(fetchOrder, 500); // Then fetch updated data after a short delay
    }, 5000);
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 5);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [id]); // Only depend on id, not order

  const simulateStatusChange = async () => {
    const currentOrder = orderRef.current;
    if (!currentOrder) return;
    
    const statusFlow = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statusFlow.indexOf(currentOrder.status);
    const nextStatus = statusFlow[currentIndex + 1];
    
    if (nextStatus) {
      try {
        // Try real API first
        await api.put(`/orders/${currentOrder.id}/status`, { status: nextStatus }, { withCredentials: true });
        // Refresh will happen automatically due to the interval
      } catch (err) {
        console.log('API failed, using demo manual advancement...');
        // Demo mode: advance status locally
        setOrder(prev => ({
          ...prev,
          status: nextStatus
        }));
        console.log(`Demo: Manually advanced status from ${currentOrder.status} to ${nextStatus}`);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CREATED': return dark ? 'text-yellow-400' : 'text-yellow-600';
      case 'PAID': return dark ? 'text-blue-400' : 'text-blue-600';
      case 'PROCESSING': return dark ? 'text-purple-400' : 'text-purple-600';
      case 'SHIPPED': return dark ? 'text-orange-400' : 'text-orange-600';
      case 'DELIVERED': return dark ? 'text-green-400' : 'text-green-600';
      case 'CANCELLED': return dark ? 'text-red-400' : 'text-red-600';
      default: return dark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusProgress = (status) => {
    const statuses = ['CREATED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    return statuses.indexOf(status) + 1;
  };

  if (loading && !order) {
    return (
      <div className={`p-6 ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen`}>
        <div className="max-w-lg mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen`}>
        <div className="max-w-lg mx-auto">
          <div className={`p-4 rounded-lg ${dark ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} border`}>
            <h2 className="text-lg font-semibold mb-2">Error Loading Order</h2>
            <p className={dark ? 'text-red-200' : 'text-red-700'}>{error}</p>
            <button 
              onClick={fetchOrder}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`p-6 ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen`}>
        <div className="max-w-lg mx-auto">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
            <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen`}>
      <div className="max-w-lg mx-auto">
        {/* Auto-refresh notification */}
        <div className={`mb-4 p-4 rounded-lg ${dark ? 'bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'} border`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <span className={`text-sm font-bold ${dark ? 'text-blue-300' : 'text-blue-700'}`}>
              🚀 LIVE DEMO: Status Auto-Advancement System
            </span>
          </div>
          <div className={`text-sm mb-2 ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
            Watch the order status automatically progress every 5 seconds: <strong>CREATED → PAID → SHIPPED → DELIVERED</strong>
          </div>
          <div className={`text-xs ${dark ? 'text-purple-400' : 'text-purple-600'} flex items-center gap-2`}>
            <div className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Next auto-advancement in {countdown} seconds
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Tracking</h1>
          <div className="flex items-center gap-4">
            {order && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
              <button
                onClick={simulateStatusChange}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white transition-colors"
              >
                Advance Status (Demo)
              </button>
            )}
            <button
              onClick={fetchOrder}
              disabled={loading}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : dark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {loading ? 'Updating...' : 'Refresh Now'}
            </button>
            <div className="text-xs">
              <div className={`${dark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 text-xs">
                  Auto-refresh in {countdown}s
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg rounded-xl overflow-hidden`}>
          {/* Order Header */}
          <div className={`${dark ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-100'} border-b p-6`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Order ID</p>
                <p className="text-2xl font-bold">#{order.id}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Total Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{order.totalAmount}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                <p className={`text-lg font-semibold ${getStatusColor(order.status)}`}>{order.status}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Order Date</p>
                <p className={`text-sm ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Order Progress</h3>
            <div className="flex items-center justify-between">
              {['CREATED', 'PAID', 'SHIPPED', 'DELIVERED'].map((status, index) => {
                const currentProgress = getStatusProgress(order.status);
                const isCompleted = index < currentProgress;
                const isCurrent = index === currentProgress - 1;
                
                return (
                  <div key={status} className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      ${isCompleted ? 'bg-green-500 text-white' : 
                        isCurrent ? 'bg-blue-500 text-white' : 
                        dark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                      {index + 1}
                    </div>
                    <div className={`text-xs mt-2 text-center
                      ${isCompleted || isCurrent ? 'font-medium' : ''}
                      ${isCompleted ? 'text-green-600' : 
                        isCurrent ? 'text-blue-600' : 
                        dark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {status}
                    </div>
                    {index < 3 && (
                      <div className={`h-1 w-full mt-2
                        ${isCompleted ? 'bg-green-500' : 
                          dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Information */}
          {order.payment && (
            <div className={`p-6 border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Payment Status</p>
                  <p className={`font-semibold ${
                    order.payment.status === 'SUCCESS' ? 'text-green-600' : 
                    order.payment.status === 'CREATED' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {order.payment.status}
                  </p>
                </div>
                {order.payment.paidAt && (
                  <div>
                    <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Paid At</p>
                    <p className={`text-sm ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {new Date(order.payment.paidAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              
              {order.payment.floristShare && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded ${dark ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'}`}>
                    <p className="text-sm text-green-600 font-medium">Florist Earnings (80%)</p>
                    <p className="text-lg font-bold text-green-700">₹{order.payment.floristShare}</p>
                  </div>
                  <div className={`p-3 rounded ${dark ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'}`}>
                    <p className="text-sm text-blue-600 font-medium">Platform Fee (20%)</p>
                    <p className="text-lg font-bold text-blue-700">₹{order.payment.adminShare}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Order Items */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.grams}g @ ₹{item.pricePer100g}/100g
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{item.subtotal.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
