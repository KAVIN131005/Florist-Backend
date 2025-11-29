import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ThemeContext } from "../../context/themeContextDefinition";
import orderService, { LOCAL_ORDER_STATUSES } from "../../services/orderService";

export default function OrderDetailsLocal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dark } = useContext(ThemeContext);
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
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-6xl mb-4 opacity-50">🔍</div>
        <h2 className={`text-2xl font-semibold ${dark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Order Not Found</h2>
        <p className={`${dark ? 'text-gray-300' : 'text-gray-500'} mb-6 text-center max-w-sm`}>We couldn't find this order in your local orders.</p>
        <button 
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2" 
          onClick={() => navigate(-1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${dark ? 'text-white' : 'text-gray-800'} flex items-center gap-3`}>
          <span className={`inline-block p-2 rounded-full ${dark ? 'bg-pink-900' : 'bg-pink-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${dark ? 'text-pink-400' : 'text-pink-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </span>
          Order #{order.id}
        </h1>
        <button 
          onClick={() => navigate(-1)} 
          className={`${dark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} p-2 rounded-full transition-all duration-300`}
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-lg rounded-2xl overflow-hidden border mb-8`}>
        <div className={`p-6 ${dark ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-white to-gray-50'}`}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div className="mb-4 md:mb-0">
              <span className={`
                inline-block px-4 py-1 rounded-full text-sm font-medium
                ${dark ? (
                  order.status === 'DELIVERED' ? 'bg-green-900 text-green-300' : 
                  order.status === 'SHIPPED' ? 'bg-blue-900 text-blue-300' : 
                  order.status === 'PROCESSING' ? 'bg-yellow-900 text-yellow-300' : 
                  order.status === 'CANCELLED' ? 'bg-red-900 text-red-300' : 
                  'bg-gray-700 text-gray-300'
                ) : (
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                  order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : 
                  order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' : 
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                  'bg-gray-100 text-gray-700'
                )}
              `}>
                {order.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>Order Total</p>
                <p className={`font-bold text-lg ${dark ? 'text-green-400' : 'text-green-600'}`}>₹{order.total}</p>
              </div>
              <div>
                <p className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>Order Date</p>
                <p className={dark ? 'text-gray-200' : ''}>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={advance} 
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm shadow hover:shadow-md transition-all duration-300 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              Advance Status
            </button>
            
            <div className="relative">
              <select 
                onChange={manualSet} 
                value={order.status} 
                className={`appearance-none border ${dark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} rounded-full px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                {LOCAL_ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className={`h-4 w-4 ${dark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <button
              onClick={() => setAutoProgress(a => !a)}
              className={`px-4 py-2 rounded-full text-sm flex items-center gap-1 transition-all duration-300 ${
                autoProgress 
                ? "bg-orange-500 text-white hover:bg-orange-600" 
                : dark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {autoProgress 
                ? <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pause Auto
                  </>
                : <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resume Auto
                  </>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Visual timeline */}
      <div className="mb-10">
        <h2 className={`text-lg font-semibold mb-6 ${dark ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${dark ? 'text-pink-400' : 'text-pink-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Live Timeline
        </h2>
        
        <div className="relative mb-8 pb-2">
          <div className={`h-2 ${dark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full shadow-inner`} />
          <div 
            className="h-2 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full absolute top-0 left-0 transition-all duration-700" 
            style={{ width: `${progressPercent}%` }} 
          />
          <div className="absolute inset-0 flex justify-between">
            {progressionStages.map((stage, idx) => {
              const reached = progressionStages.indexOf(order.status) >= idx;
              const isActive = order.status === stage;
              return (
                <div 
                  key={stage} 
                  className="flex flex-col items-center -translate-x-1/2" 
                  style={{ left: `${(idx/(progressionStages.length-1))*100}%` }}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-md
                    transform transition-all duration-500
                    ${isActive ? "scale-125" : ""}
                    ${reached 
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 border-pink-600 text-white" 
                      : dark ? "bg-gray-700 border-gray-600 text-gray-400" : "bg-white border-gray-300 text-gray-400"}
                  `}>
                    {reached ? "✓" : idx+1}
                  </div>
                  <span className={`
                    mt-2 text-xs tracking-wide text-center max-w-[80px] font-medium
                    ${reached 
                      ? dark ? "text-pink-400" : "text-pink-600" 
                      : dark ? "text-gray-500" : "text-gray-400"}
                  `}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {autoProgress && (
          <div className={`text-sm ${dark 
            ? 'text-blue-300 bg-blue-900 border-blue-600' 
            : 'text-gray-500 bg-blue-50 border-blue-400'
          } border-l-4 p-3 rounded-r-lg animate-pulse`}>
            <span className="font-medium">Auto-update active:</span> Status will advance every 5 seconds until delivery.
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${dark ? 'text-pink-400' : 'text-pink-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Order Items
        </h2>
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-lg rounded-xl overflow-hidden border`}>
          <ul className={`${dark ? 'divide-gray-700' : 'divide-gray-100'} divide-y`}>
            {order.items.map(it => (
              <li key={it.id} className={`p-4 ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 ${dark ? 'bg-gray-700' : 'bg-gray-100'} rounded-md flex items-center justify-center ${dark ? 'text-gray-300' : 'text-gray-500'} mr-4 overflow-hidden`}>
                      {it.imageUrl ? 
                        <img src={it.imageUrl} alt={it.name} className="w-full h-full object-cover object-center rounded-md" /> :
                        <span className="text-lg">🌸</span>
                      }
                    </div>
                    <div>
                      <h3 className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{it.name}</h3>
                      <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Qty: {it.quantity} × ₹{it.price}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>₹{(it.price * it.quantity).toFixed(2)}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className={`${dark ? 'bg-gray-700 border-gray-700' : 'bg-gray-50 border-gray-100'} p-4 border-t`}>
            <div className="flex justify-between font-medium">
              <span className={dark ? 'text-white' : ''}>Total</span>
              <span className={dark ? 'text-green-400' : 'text-green-600'}>₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`${dark 
        ? 'bg-gradient-to-r from-pink-900 to-pink-800 bg-opacity-50' 
        : 'bg-gradient-to-r from-pink-50 to-pink-100'
      } p-6 rounded-2xl mb-8`}>
        <h2 className={`text-lg font-semibold mb-4 ${dark ? 'text-pink-300' : 'text-pink-700'}`}>Order Details</h2>
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div>
            <p className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>Order ID</p>
            <p className={`font-mono ${dark ? 'text-white' : ''}`}>{order.id}</p>
          </div>
          <div>
            <p className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
            <p className={`font-medium ${dark ? 'text-white' : ''}`}>{order.status}</p>
          </div>
          <div>
            <p className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>Created At</p>
            <p className={dark ? 'text-white' : ''}>{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>Last Updated</p>
            <p className={dark ? 'text-white' : ''}>{new Date(order.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
