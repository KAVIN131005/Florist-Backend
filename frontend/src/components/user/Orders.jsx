import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import orderService from "../../services/orderService";
import { useAuth } from "../../hooks/useAuth";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const userId = user?.id || user?._id || user?.userId;
  const { dark } = useContext(ThemeContext);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // If we have a logged in user try backend, else just read guest/local
      if (userId) {
        try {
          const backendOrders = await orderService.myOrders();
          if (!cancelled) setOrders(backendOrders || []);
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
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${dark ? 'text-white' : 'text-gray-800'} font-serif relative
          after:content-[''] after:absolute after:w-16 after:h-1 
          after:bg-pink-400 after:bottom-[-8px] after:left-0
          after:rounded-full`}
        >
          My Orders
        </h1>
        {!userId && (
          <p className={`text-sm ${dark ? 'text-gray-300 bg-gray-800 border-yellow-500' : 'text-gray-500 bg-yellow-50 border-yellow-400'} mt-4 border-l-4 p-3 rounded-r-lg`}>
            Viewing local orders (not signed in). <Link to="/login" className="text-pink-600 hover:text-pink-700 underline">Sign in</Link> to see all your orders.
          </p>
        )}
      </header>
      
      {orders.length === 0 ? (
        <div className={`text-center p-12 ${dark ? 'bg-gray-800' : 'bg-gray-50'} rounded-3xl shadow-inner`}>
          <div className="text-6xl md:text-7xl mb-4 opacity-50">📦</div>
          <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-600'} mb-2`}>No Orders Yet</h2>
          <p className={`${dark ? 'text-gray-300' : 'text-gray-500'} max-w-md mx-auto mb-6`}>You haven't placed any orders yet. Start shopping to see your orders here.</p>
          <Link 
            to="/shop" 
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            Browse Products <span>🌸</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(order => (
            <div 
              key={order.id} 
              className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-lg hover:shadow-xl rounded-2xl overflow-hidden border transition-all duration-300 transform hover:scale-[1.02]`}
            >
              <div className={`${dark ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-gray-50 to-white'} p-4 sm:p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Order ID</p>
                    <p className={`font-mono font-medium ${dark ? 'text-white' : ''}`}>{order.id}</p>
                  </div>
                  <div>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium inline-block
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
                </div>
                
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Total Amount</p>
                    <p className={`text-lg font-bold ${dark ? 'text-green-400' : 'text-green-600'}`}>₹{order.totalAmount || '0.00'}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} text-right`}>Order Date</p>
                    <p className={`text-sm ${dark ? 'text-gray-200' : ''}`}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                
                <div className={`border-t ${dark ? 'border-gray-700' : 'border-gray-100'} pt-4`}>
                  <p className={`text-sm font-medium mb-2 ${dark ? 'text-white' : ''}`}>Items</p>
                  {order.items && order.items.length > 0 ? (
                    <ul className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'} space-y-1 max-h-24 overflow-y-auto pr-2 scrollbar-thin`}>
                      {order.items.map((it, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span className="truncate flex-1">{it.productName} - {it.grams}g</span>
                          <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>₹{it.subtotal.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>No item details available</p>
                  )}
                </div>
              </div>
              
              <Link 
                to={`/orders/${order.id}`} 
                className={`text-center py-3 border-t ${dark ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border-gray-100 bg-gray-50 hover:bg-pink-50'} text-pink-500 font-medium transition-colors duration-300 flex items-center justify-center gap-2`}
              >
                <span>Track Order</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
