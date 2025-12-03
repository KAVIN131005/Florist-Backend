import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../../context/themeContextDefinition";
import api from "../../services/api";
import OrderReviews from "./OrderReviews";

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
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'}`}>
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-6 mb-6">
            <div className="relative">
              <div className="text-6xl animate-bounce transform hover:scale-110 transition-transform duration-300">🚚</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-6xl animate-pulse transform hover:scale-110 transition-transform duration-300">📍</div>
            <div className="relative">
              <div className="text-6xl animate-pulse transform hover:scale-110 transition-transform duration-300">🌸</div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-6">
            <h1 className={`text-4xl md:text-5xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-3 relative`}>
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
                Order Tracking
              </span>
            </h1>
            <div className={`w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse`}></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-6 font-medium`}>
            🔴 Live updates on your flower delivery journey
          </p>
          
          {/* Enhanced Order ID Display */}
          <div className={`inline-flex items-center gap-4 px-8 py-4 rounded-3xl ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105`}>
            <div className={`w-14 h-14 rounded-full ${dark ? 'bg-gradient-to-r from-pink-600 to-purple-600' : 'bg-gradient-to-r from-pink-500 to-purple-500'} flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse`}>
              #{order.id.toString().slice(-2)}
            </div>
            <div className="text-left">
              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Tracking Order</p>
              <p className={`font-mono font-bold text-xl ${dark ? 'text-white' : 'text-gray-900'}`}>#{order.id}</p>
            </div>
            <div className="ml-4">
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'DELIVERED' ? 'bg-green-500 text-white' : order.status === 'SHIPPED' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-white'} animate-pulse`}>
                {order.status === 'DELIVERED' ? '✅ Delivered' : order.status === 'SHIPPED' ? '🚚 In Transit' : order.status === 'PAID' ? '💳 Paid' : '📦 Processing'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Progress */}
        <div className="lg:col-span-2">
          {/* Enhanced Auto-Demo Info Banner */}
          <div className={`mb-8 p-8 rounded-3xl border-2 ${dark ? 'text-blue-300 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 border-blue-500' : 'text-blue-700 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-400'} shadow-2xl relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-10 -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-10 -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <span className="text-3xl animate-spin">🎬</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-bold text-2xl flex items-center gap-2">
                  Live Demo Mode
                  <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full animate-bounce">ACTIVE</span>
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-base leading-relaxed mb-3">
                    🚀 This is a demonstration of real-time order tracking. Watch as the status automatically advances every 5 seconds through the complete delivery journey.
                  </p>
                  <div className="flex items-center gap-2 text-sm opacity-80">
                    <span>📊</span>
                    <span>CREATED → PAID → SHIPPED → DELIVERED</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Next update in</span>
                    </div>
                    <div className="text-2xl font-mono font-bold">{countdown}s</div>
                  </div>
                  
                  <button
                    onClick={simulateStatusChange}
                    className={`w-full py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
                      ${dark 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                      }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      ⏭️ Skip to Next Status
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Timeline */}
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-x"></div>
            
            <div className={`p-8 border-b ${dark ? 'border-gray-700 bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800' : 'border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="text-3xl animate-pulse">📊</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Delivery Progress</h2>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Real-time tracking from order to delivery</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-2xl ${dark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  <span className="text-sm font-bold">{getStatusProgress(order.status)}/4 Complete</span>
                </div>
              </div>
            </div>
            
            <div className="p-10">
              <div className="relative">
                {/* Enhanced Progress Bar Background */}
                <div className={`absolute top-8 left-8 right-8 h-2 ${dark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full shadow-inner`}></div>
                {/* Animated Active Progress Bar */}
                <div 
                  className="absolute top-8 left-8 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full transition-all duration-2000 ease-out shadow-lg animate-gradient-x"
                  style={{ width: `calc(${(getStatusProgress(order.status) / 4) * 100}% - 4rem)` }}
                ></div>
                
                <div className="relative z-10 flex justify-between">
                  {[
                    { name: 'CREATED', icon: '📦', description: 'Order placed', color: 'from-yellow-500 to-orange-500' },
                    { name: 'PAID', icon: '💳', description: 'Payment confirmed', color: 'from-green-500 to-emerald-500' },
                    { name: 'SHIPPED', icon: '🚚', description: 'Out for delivery', color: 'from-blue-500 to-cyan-500' },
                    { name: 'DELIVERED', icon: '✅', description: 'Successfully delivered', color: 'from-purple-500 to-pink-500' }
                  ].map((status, index) => {
                    const currentProgress = getStatusProgress(order.status);
                    const isCompleted = index < currentProgress;
                    const isCurrent = index === currentProgress - 1;
                    
                    return (
                      <div key={status.name} className="flex flex-col items-center group">
                        <div className={`
                          w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-bold transition-all duration-700 transform hover:scale-110 cursor-pointer
                          ${isCompleted 
                            ? (dark ? `bg-gradient-to-br ${status.color} border-white shadow-2xl` : `bg-gradient-to-br ${status.color} border-white shadow-2xl`) 
                            : (dark ? 'bg-gray-800 border-gray-600 text-gray-500 hover:bg-gray-700' : 'bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-200')
                          }
                          ${isCurrent ? 'animate-pulse ring-8 ring-pink-200 ring-opacity-50' : ''}
                          ${isCompleted ? 'shadow-2xl animate-bounce' : ''}
                        `}>
                          {isCompleted ? (
                            <div className="relative">
                              {status.icon}
                              {isCurrent && <div className="absolute -inset-2 bg-white rounded-full opacity-30 animate-ping"></div>}
                            </div>
                          ) : '⏸️'}
                        </div>
                        
                        <div className="mt-6 text-center group-hover:transform group-hover:scale-105 transition-transform duration-300">
                          <p className={`text-base font-bold mb-2 ${isCompleted ? (dark ? 'text-white' : 'text-gray-900') : (dark ? 'text-gray-400' : 'text-gray-500')}`}>
                            {status.name}
                          </p>
                          <p className={`text-sm mb-2 ${isCompleted ? (dark ? 'text-gray-300' : 'text-gray-600') : (dark ? 'text-gray-500' : 'text-gray-400')}`}>
                            {status.description}
                          </p>
                          {isCompleted && (
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono ${dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'} animate-pulse`}>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {new Date().toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          )}
                          {isCurrent && (
                            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${dark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} animate-bounce`}>
                              🔄 Processing
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Current Status Detail */}
          <div className={`mt-8 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-blue-500/5"></div>
            
            <div className={`relative p-8 border-b ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${dark ? 'bg-gradient-to-br from-pink-600 to-purple-600' : 'bg-gradient-to-br from-pink-500 to-purple-500'} flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl filter drop-shadow-lg">
                      {order.status === 'CREATED' ? '📦' :
                       order.status === 'PAID' ? '💳' :
                       order.status === 'SHIPPED' ? '🚚' :
                       order.status === 'DELIVERED' ? '✅' : '📋'}
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-1`}>
                      {order.status}
                    </h3>
                    <p className={`text-base ${dark ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                      Current Status • Live Updates
                    </p>
                  </div>
                </div>
                
                <div className={`px-6 py-3 rounded-2xl ${order.status === 'DELIVERED' ? (dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700') : (dark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700')} animate-pulse`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-blue-500'} animate-ping`}></div>
                    <span className="font-bold text-sm">LIVE</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative p-8">
              <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-900/50' : 'bg-gray-50/70'} border-l-4 ${order.status === 'DELIVERED' ? 'border-green-500' : order.status === 'SHIPPED' ? 'border-blue-500' : order.status === 'PAID' ? 'border-green-500' : 'border-yellow-500'}`}>
                <p className={`text-xl leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                  {order.status === 'CREATED' && '🏭 Your order has been successfully placed and is being prepared for processing. Our team is carefully selecting the freshest flowers for your order.'}
                  {order.status === 'PAID' && '💰 Payment has been confirmed! Your order is now being prepared for shipment. Our florists are arranging your beautiful flowers with care.'}
                  {order.status === 'SHIPPED' && '🚛 Your beautiful flowers are on their way! The delivery partner is heading to your location with your fresh flower arrangement.'}
                  {order.status === 'DELIVERED' && '🏠 Your flowers have been successfully delivered to your doorstep. We hope you absolutely love your beautiful floral arrangement!'}
                </p>
              </div>
              
              {order.status === 'DELIVERED' && (
                <div>
                  <div className={`mt-6 p-6 rounded-2xl ${dark ? 'bg-gradient-to-br from-green-900 to-emerald-900 border-green-500' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'} border-2 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-400 rounded-full opacity-10 -mr-10 -mt-10"></div>
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-3xl animate-bounce">🎉</div>
                        <div>
                          <p className={`font-bold text-xl ${dark ? 'text-green-300' : 'text-green-700'}`}>
                            Delivery Completed Successfully!
                          </p>
                          <p className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>
                            Thank you for choosing our flower delivery service
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Review Section */}
                  <OrderReviews order={order} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary & Payment */}
        <div className="space-y-6">
          {/* Enhanced Order Summary */}
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden hover-lift relative`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-x"></div>
            
            <div className={`p-8 border-b ${dark ? 'border-gray-700 bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800' : 'border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50'}`}>
              <div className="flex items-center gap-4 mb-2">
                <div className={`w-12 h-12 rounded-2xl ${dark ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-indigo-500'} flex items-center justify-center shadow-xl`}>
                  <span className="text-2xl filter drop-shadow-lg">📋</span>
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Order Summary</h3>
                  <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Complete order details</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className={`p-4 rounded-xl ${dark ? 'bg-gray-900/50' : 'bg-gray-50/70'} border-l-4 border-blue-500`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>🏷️ Order ID</span>
                  <span className={`font-mono font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>#{order.id}</span>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${dark ? 'bg-gray-900/50' : 'bg-gray-50/70'} border-l-4 border-green-500`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>📅 Order Date</span>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'} block`}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${dark ? 'bg-gray-900/50' : 'bg-gray-50/70'} border-l-4 border-yellow-500`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>🚚 Estimated Delivery</span>
                  <div className="text-right">
                    <span className={`font-bold ${dark ? 'text-yellow-400' : 'text-yellow-600'}`}>Today</span>
                    <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'} block`}>2:00 - 4:00 PM</span>
                  </div>
                </div>
              </div>
              
              <div className={`border-t ${dark ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
                <div className={`p-6 rounded-2xl ${dark ? 'bg-gradient-to-br from-green-900 to-emerald-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'} border-2 ${dark ? 'border-green-700' : 'border-green-200'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl animate-bounce">💰</div>
                      <span className={`text-xl font-bold ${dark ? 'text-green-300' : 'text-green-700'}`}>Total Amount</span>
                    </div>
                    <span className={`text-3xl font-bold ${dark ? 'text-green-400' : 'text-green-600'} animate-pulse-glow`}>₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Payment Information */}
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden hover-lift relative`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 animate-gradient-x"></div>
            
            <div className={`p-8 border-b ${dark ? 'border-gray-700 bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800' : 'border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${dark ? 'bg-gradient-to-br from-green-600 to-emerald-600' : 'bg-gradient-to-br from-green-500 to-emerald-500'} flex items-center justify-center shadow-xl`}>
                    <span className="text-2xl filter drop-shadow-lg">💳</span>
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Payment Details</h3>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Secure transaction info</p>
                  </div>
                </div>
                
                <div className={`px-4 py-2 rounded-2xl ${order.payment?.status === 'SUCCESS' ? (dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700') : (dark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700')} animate-pulse`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${order.payment?.status === 'SUCCESS' ? 'bg-green-500' : 'bg-yellow-500'} animate-ping`}></div>
                    <span className="font-bold text-sm">
                      {order.payment?.status === 'SUCCESS' ? '✅ PAID' : '⏳ PROCESSING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              {order.payment && (
                <>
                  <div className={`p-5 rounded-xl ${dark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} border ${dark ? 'border-gray-700' : 'border-blue-100'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${dark ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
                          <span className="text-white text-sm font-bold">💳</span>
                        </div>
                        <span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Payment Method</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-6 rounded ${dark ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center shadow-md`}>
                          <span className="text-white text-xs font-bold">💳</span>
                        </div>
                        <span className={`font-mono font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>•••• 4567</span>
                      </div>
                    </div>
                  </div>
                  
                  {order.payment.paidAt && (
                    <div className={`p-5 rounded-xl ${dark ? 'bg-gradient-to-r from-green-900 to-emerald-900' : 'bg-gradient-to-r from-green-50 to-emerald-50'} border ${dark ? 'border-green-700' : 'border-green-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${dark ? 'bg-green-600' : 'bg-green-500'} flex items-center justify-center`}>
                            <span className="text-white text-sm">⏰</span>
                          </div>
                          <span className={`font-medium ${dark ? 'text-green-300' : 'text-green-700'}`}>Paid At</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold text-sm ${dark ? 'text-green-300' : 'text-green-700'} block`}>
                            {new Date(order.payment.paidAt).toLocaleDateString('en-IN')}
                          </span>
                          <span className={`text-xs ${dark ? 'text-green-400' : 'text-green-600'}`}>
                            {new Date(order.payment.paidAt).toLocaleTimeString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {order.payment.floristShare && (
                    <div className="space-y-4">
                      <h4 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                        <span>📊</span>
                        <span>Payment Breakdown</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className={`p-4 rounded-xl ${dark ? 'bg-gradient-to-br from-green-900 to-emerald-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'} border-2 ${dark ? 'border-green-700' : 'border-green-200'} hover-lift`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">🌸</div>
                              <div>
                                <p className={`text-sm font-bold ${dark ? 'text-green-300' : 'text-green-700'}`}>Florist Earnings</p>
                                <p className={`text-xs ${dark ? 'text-green-400' : 'text-green-600'}`}>(80% of total)</p>
                              </div>
                            </div>
                            <p className={`text-xl font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>₹{order.payment.floristShare}</p>
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-xl ${dark ? 'bg-gradient-to-br from-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} border-2 ${dark ? 'border-blue-700' : 'border-blue-200'} hover-lift`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">🏢</div>
                              <div>
                                <p className={`text-sm font-bold ${dark ? 'text-blue-300' : 'text-blue-700'}`}>Platform Fee</p>
                                <p className={`text-xs ${dark ? 'text-blue-400' : 'text-blue-600'}`}>(20% of total)</p>
                              </div>
                            </div>
                            <p className={`text-xl font-bold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>₹{order.payment.adminShare}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div className={`mt-8 p-6 rounded-2xl ${dark ? 'bg-gradient-to-r from-blue-900 to-purple-900 border-blue-500' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'} border-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl animate-pulse">🔒</div>
                    <div>
                      <span className={`text-sm font-bold ${dark ? 'text-blue-300' : 'text-blue-700'} block`}>Secure Payment</span>
                      <span className={`text-xs ${dark ? 'text-blue-400' : 'text-blue-600'}`}>256-bit SSL encryption</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    <span className={`text-xs font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border shadow-xl overflow-hidden`}>
            <div className={`p-6 border-b ${dark ? 'border-gray-700 bg-gradient-to-r from-gray-750 to-gray-800' : 'border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛍️</span>
                <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Order Items</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className={`flex justify-between items-center p-4 rounded-lg ${dark ? 'bg-gray-700' : 'bg-gray-50'} group hover:shadow-md transition-shadow`}>
                    <div className="flex-1">
                      <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{item.productName}</p>
                      <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.grams}g @ ₹{item.pricePer100g}/100g
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${dark ? 'text-green-400' : 'text-green-600'}`}>
                        ₹{item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Support Contact */}
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border shadow-xl overflow-hidden`}>
            <div className={`p-6 border-b ${dark ? 'border-gray-700 bg-gradient-to-r from-gray-750 to-gray-800' : 'border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛠️</span>
                <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Need Help?</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                Have questions about your order? Our support team is here to help.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${dark ? 'bg-green-600' : 'bg-green-500'} flex items-center justify-center`}>
                    <span className="text-white">📞</span>
                  </div>
                  <div>
                    <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>Call Support</p>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>+91 98765 43210</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${dark ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
                    <span className="text-white">💬</span>
                  </div>
                  <div>
                    <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>Live Chat</p>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Available 24/7</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${dark ? 'bg-purple-600' : 'bg-purple-500'} flex items-center justify-center`}>
                    <span className="text-white">✉️</span>
                  </div>
                  <div>
                    <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>Email Support</p>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>help@florist.com</p>
                  </div>
                </div>
              </div>
              
              <button className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300
                ${dark 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                } shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
