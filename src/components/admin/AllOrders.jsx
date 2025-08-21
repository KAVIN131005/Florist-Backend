import React, { useEffect, useState, useContext } from "react";
import adminService from "../../services/adminService";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function AllOrders(){
  const { dark, toggle } = useContext(ThemeContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders();
      setOrders(data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className={`flex justify-center items-center h-60 ${dark ? 'text-white' : 'text-gray-500'}`}>
      <div className={`
        w-10 h-10 border-4 rounded-full animate-spin 
        ${dark ? 'border-pink-300 border-t-transparent' : 'border-pink-500 border-t-transparent'}
      `}></div>
    </div>
  );

  return (
    <div className={`p-6 md:p-8 ${dark ? 'text-white' : 'text-gray-800'}`}>
      <header className="mb-8">
        <h2 className={`text-2xl md:text-3xl font-bold relative
          ${dark ? 'text-pink-200' : 'text-pink-600'}
          after:content-[""] after:absolute after:w-16 after:h-1 
          after:bg-pink-400 after:bottom-[-8px] after:left-0
          after:rounded-full
        `}>All Orders</h2>
        <p className={`mt-4 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage customer orders and update their status
        </p>
      </header>
      
      {/* Theme toggle */}
      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={toggle}
          className={`
            relative w-16 h-7 rounded-full 
            transition-all duration-500 ease-in-out
            ${dark ? 'bg-gray-600 shadow-inner' : 'bg-pink-100 shadow'} 
            flex items-center px-1
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400
            hover:shadow-lg
          `}
          title="Toggle theme"
        >
          <span className={`
            absolute h-5 w-5 rounded-full shadow transform transition-all duration-500 ease-in-out
            ${dark 
              ? 'translate-x-9 bg-pink-300' 
              : 'translate-x-0 bg-white'
            }
          `}></span>
          <span className="flex justify-between w-full text-[10px] font-semibold z-10 select-none">
            <span className={`transition-opacity duration-300 ${dark ? 'opacity-30' : 'opacity-100'}`}>🌞</span>
            <span className={`transition-opacity duration-300 ${dark ? 'opacity-100' : 'opacity-30'}`}>🌙</span>
          </span>
        </button>
      </div>
      
      <div className={`
        rounded-xl shadow-lg overflow-hidden
        ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
      `}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={dark ? 'bg-gray-900' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 md:px-6 py-4 text-left text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Order ID</th>
                <th className={`px-4 md:px-6 py-4 text-left text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Customer</th>
                <th className={`px-4 md:px-6 py-4 text-left text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Amount</th>
                <th className={`px-4 md:px-6 py-4 text-left text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                <th className={`px-4 md:px-6 py-4 text-left text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, index) => (
                <tr 
                  key={o.id} 
                  className={`
                    ${index % 2 === 0 ? (dark ? 'bg-gray-800' : 'bg-white') : (dark ? 'bg-gray-750' : 'bg-gray-50')}
                    hover:bg-opacity-80
                    ${dark ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-pink-50 border-gray-100'}
                    border-t transition-colors duration-150
                  `}
                >
                  <td className="px-4 md:px-6 py-4 font-medium">{o.id}</td>
                  <td className="px-4 md:px-6 py-4">{o.user?.name ?? o.user?.email}</td>
                  <td className={`px-4 md:px-6 py-4 font-semibold ${dark ? 'text-green-300' : 'text-green-600'}`}>
                    ₹{o.totalAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                      ${o.status === 'DELIVERED' 
                        ? dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700' 
                        : o.status === 'FAILED' 
                          ? dark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600' 
                          : o.status === 'SHIPPED'
                            ? dark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                            : o.status === 'PROCESSING'
                              ? dark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-600'
                              : dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => window.location = `/admin/orders/${o.id}`} 
                        className={`
                          px-3 py-1.5 rounded-full transition-all duration-300 text-sm
                          ${dark 
                            ? 'bg-blue-800 hover:bg-blue-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }
                          shadow hover:shadow-md transform hover:scale-105
                        `}
                      >
                        View
                      </button>
                      <button 
                        onClick={() => { 
                          if(confirm("Are you sure you want to mark this order as shipped?")) 
                            adminService.updateOrderStatus(o.id, 'SHIPPED').then(()=>load()) 
                        }} 
                        className={`
                          px-3 py-1.5 rounded-full transition-all duration-300 text-sm
                          ${dark 
                            ? 'bg-yellow-800 hover:bg-yellow-700 text-white' 
                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          }
                          shadow hover:shadow-md transform hover:scale-105
                        `}
                      >
                        Ship
                      </button>
                      <button 
                        onClick={() => { 
                          if(confirm("Are you sure you want to mark this order as delivered?")) 
                            adminService.updateOrderStatus(o.id, 'DELIVERED').then(()=>load()) 
                        }} 
                        className={`
                          px-3 py-1.5 rounded-full transition-all duration-300 text-sm
                          ${dark 
                            ? 'bg-green-800 hover:bg-green-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                          }
                          shadow hover:shadow-md transform hover:scale-105
                        `}
                      >
                        Deliver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className={`p-8 text-center ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No orders have been placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
