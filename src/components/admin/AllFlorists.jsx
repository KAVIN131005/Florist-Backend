import React, { useEffect, useState, useContext } from "react";
import adminService from "../../services/adminService";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function AllFlorists(){
  const { dark, toggle } = useContext(ThemeContext);
  const [florists, setFlorists] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const users = await adminService.getUsers();
      const fs = (users || []).filter(u => (u.roles || []).includes("FLORIST"));
      setFlorists(fs);
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
        `}>All Florists</h2>
        <p className={`mt-4 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage registered florist accounts on the platform
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

      <div className="grid gap-4 md:gap-6">
        {florists.map(f => (
          <div 
            key={f.id} 
            className={`
              rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
              transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg
              ${dark ? 'bg-gray-800 border border-gray-700 shadow-md' : 'bg-white shadow-md'}
            `}
          >
            <div className="flex-grow">
              <div className={`font-medium text-lg mb-1 ${dark ? 'text-pink-200' : 'text-pink-600'}`}>
                {f.name}
              </div>
              <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="inline-block mr-3">📧 {f.email}</span>
                {f.phone && <span className="inline-block">📱 {f.phone}</span>}
              </div>
            </div>
            <div className="space-x-2">
              <button 
                onClick={() => { 
                  if(confirm('Are you sure you want to delete this florist?')) 
                    adminService.deleteUser(f.id)
                      .then(()=>load())
                      .catch(()=>alert('Delete operation failed. Please try again.')); 
                }} 
                className={`
                  px-4 py-2 rounded-full transition-all duration-300 font-medium
                  ${dark 
                    ? 'bg-red-800 hover:bg-red-700 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                  }
                  transform hover:scale-105 hover:shadow-md
                `}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {florists.length === 0 && (
          <div className={`
            text-center p-12 rounded-lg 
            ${dark ? 'text-gray-400 bg-gray-800 border border-gray-700' : 'text-gray-600 bg-gray-50 border border-gray-100'}
          `}>
            No florists are registered on the platform yet.
          </div>
        )}
      </div>
    </div>
  );
}
