/* eslint-disable no-undef */
import React, { useEffect, useState, useContext } from "react";
import adminService from "../../services/adminService";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function FloristApplications() {
  const { dark, toggle } = useContext(ThemeContext);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingFloristApplications();
      setApps(data || []);
    } catch (e) {
      console.error("Error fetching pending applications:", e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    if (!confirm("Approve this application?")) return;
    try {
      await adminService.approveFlorist(id);
      await load();
      alert("Approved");
    // eslint-disable-next-line no-unused-vars
    } catch (e) { alert("Approve failed"); }
  };

  const reject = async (id) => {
    if (!confirm("Reject this application?")) return;
    try {
      await adminService.rejectFlorist(id);
      await load();
      alert("Rejected");
    // eslint-disable-next-line no-unused-vars
    } catch (e) { alert("Reject failed"); }
  };

  if (loading) return (
    <div className={`flex justify-center items-center h-60 ${dark ? 'text-white' : 'text-gray-500'}`}>
      <div className={`
        w-10 h-10 border-4 rounded-full animate-spin 
        ${dark ? 'border-pink-300 border-t-transparent' : 'border-pink-500 border-t-transparent'}
      `}></div>
    </div>
  );

  return (
    <div className={`p-6 md:p-8 space-y-6 ${dark ? 'text-white' : 'text-gray-800'}`}>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-2xl md:text-3xl font-bold relative
            ${dark ? 'text-pink-200' : 'text-pink-600'}
            after:content-[""] after:absolute after:w-16 after:h-1 
            after:bg-pink-400 after:bottom-[-8px] after:left-0
            after:rounded-full
          `}>Florist Applications</h2>
          <p className={`mt-4 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            Review and manage new vendor requests
          </p>
        </div>
        
        {/* Theme toggle */}
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
      </header>
      
      {apps.length === 0 ? (
        <div className={`
          text-center p-12 rounded-lg 
          ${dark ? 'text-gray-400 bg-gray-800 border border-gray-700' : 'text-gray-600 bg-gray-50 border border-gray-100'}
        `}>
          No pending applications at this time.
        </div>
      ) : (
        <div className="grid gap-6">
          {apps.map(a => (
            <div 
              key={a.id} 
              className={`
                rounded-xl p-6 shadow-lg
                transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl
                ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
                flex flex-col md:flex-row items-start md:items-center justify-between gap-4
              `}
            >
              <div className="flex-grow">
                <div className={`font-semibold text-xl mb-2 ${dark ? 'text-pink-200' : 'text-pink-600'}`}>
                  {a.shopName || a.applicant?.name}
                </div>
                <div className={`text-sm mb-2 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {a.description}
                </div>
                <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Status: <span className={`font-medium ${dark ? 'text-yellow-300' : 'text-yellow-600'}`}>{a.status}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => nav(`/admin/florists/${a.id}`)} 
                  className={`
                    px-4 py-2 rounded-full transition-all duration-300 font-medium
                    ${dark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }
                    shadow hover:shadow-md transform hover:scale-105
                  `}
                >
                  View Details
                </button>
                <button 
                  onClick={() => approve(a.id)} 
                  className={`
                    px-4 py-2 rounded-full transition-all duration-300 font-medium
                    ${dark 
                      ? 'bg-green-800 hover:bg-green-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                    }
                    shadow hover:shadow-md transform hover:scale-105
                  `}
                >
                  Approve
                </button>
                <button 
                  onClick={() => reject(a.id)} 
                  className={`
                    px-4 py-2 rounded-full transition-all duration-300 font-medium
                    ${dark 
                      ? 'bg-red-800 hover:bg-red-700 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                    }
                    shadow hover:shadow-md transform hover:scale-105
                  `}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
