import React, { useEffect, useState, useContext } from "react";
import adminService from "../../services/adminService";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function AllFlorists(){
  const { dark } = useContext(ThemeContext);
  const [florists, setFlorists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const deleteUser = async (id, name) => {
    if (!confirm(`Delete florist "${name}"? This action cannot be undone.`)) return;
    try {
      await adminService.deleteUser(id);
      await load();
      alert("Florist deleted successfully");
    } catch (e) {
      console.error("Delete error:", e);
      alert("Delete operation failed. Please try again.");
    }
  };

  const filteredFlorists = florists.filter(florist =>
    (florist.name || florist.email || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className={`min-h-screen flex justify-center items-center ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-white to-green-50'}`}>
      <div className="text-center">
        <div className="relative mb-8">
          <div className={`w-20 h-20 rounded-full border-4 border-t-transparent animate-spin ${dark ? 'border-emerald-400' : 'border-emerald-500'}`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl animate-ping">🌸</span>
          </div>
        </div>
        <p className={`text-xl font-semibold ${dark ? 'text-emerald-300' : 'text-emerald-600'} animate-pulse`}>
          Loading Florists...
        </p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-white to-green-50'}`}>
      {/* Enhanced Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="relative">
              <div className="text-6xl animate-bounce transform hover:scale-110 transition-transform duration-300">🌸</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-6xl animate-pulse transform hover:scale-110 transition-transform duration-300">👥</div>
            <div className="relative">
              <div className="text-6xl animate-pulse transform hover:scale-110 transition-transform duration-300">🏪</div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-4 relative`}>
              <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent animate-gradient-x">
                Manage Florists
              </span>
            </h1>
            <div className="w-40 h-1 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-green-500 animate-pulse"></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-8 font-medium max-w-2xl mx-auto`}>
            🎯 Comprehensive florist partner management and account oversight dashboard
          </p>

          {/* Search and Stats Bar */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-8">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search florists by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  w-full px-6 py-4 pl-12 rounded-3xl border focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500
                  ${dark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }
                  shadow-lg transition-all duration-300 hover:shadow-xl
                `}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                🔍
              </div>
            </div>
            
            <div className={`flex items-center gap-4 px-8 py-4 rounded-3xl ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-lg`}>
              <div className="text-3xl animate-pulse">📊</div>
              <div>
                <p className={`text-2xl font-bold ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {filteredFlorists.length}
                </p>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {searchTerm ? 'Filtered' : 'Total'} Florists
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Florists Grid */}
        {filteredFlorists.length === 0 ? (
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden`}>
            <div className="p-16 text-center">
              <div className="text-8xl mb-8 animate-bounce">{searchTerm ? '🔍' : '🌸'}</div>
              <h3 className={`text-3xl font-bold ${dark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                {searchTerm ? 'No Matching Florists' : 'No Florists Registered'}
              </h3>
              <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-500'} mb-8 max-w-md mx-auto`}>
                {searchTerm 
                  ? 'No florists match your search criteria. Try adjusting your search terms.'
                  : 'No florists are registered on the platform yet. They will appear here once they join.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${dark ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                >
                  <span>🔄</span>
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredFlorists.map((florist, index) => (
              <div 
                key={florist.id}
                className={`
                  ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
                  rounded-3xl border shadow-2xl overflow-hidden hover-lift relative
                  transform transition-all duration-300 hover:scale-[1.02]
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 animate-gradient-x"></div>
                
                <div className="p-8">
                  {/* Florist Avatar and Info */}
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-3xl ${dark ? 'bg-gradient-to-br from-emerald-600 to-green-600' : 'bg-gradient-to-br from-emerald-500 to-green-500'} flex items-center justify-center shadow-xl animate-pulse mb-4`}>
                      <span className="text-4xl filter drop-shadow-lg">🌺</span>
                    </div>
                    
                    <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {florist.name || 'Unnamed Florist'}
                    </h3>
                    
                    <div className="flex justify-center mb-4">
                      <span className={`px-4 py-2 rounded-2xl text-sm font-bold ${dark ? 'bg-emerald-900 text-emerald-300 border border-emerald-700' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                        🌸 FLORIST
                      </span>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="space-y-4 mb-6">
                    {florist.email && (
                      <div className={`p-4 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📧</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold ${dark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                              Email Address
                            </p>
                            <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'} truncate`}>
                              {florist.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {florist.phone && (
                      <div className={`p-4 rounded-2xl ${dark ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-700'} border ${dark ? 'border-blue-700' : 'border-blue-100'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📱</span>
                          <div className="flex-1">
                            <p className="text-xs font-semibold mb-1">Phone Number</p>
                            <p className="text-sm font-medium">
                              {florist.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className={`p-4 rounded-2xl ${dark ? 'bg-purple-900 text-purple-200' : 'bg-purple-50 text-purple-700'} border ${dark ? 'border-purple-700' : 'border-purple-100'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🆔</span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold mb-1">Account ID</p>
                          <p className="text-sm font-medium font-mono">
                            {florist.id?.toString().slice(-8) || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => deleteUser(florist.id, florist.name)} 
                      className={`
                        w-full px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl
                        ${dark ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'}
                        flex items-center justify-center gap-3
                      `}
                    >
                      <span className="text-xl">🗑️</span>
                      Remove Florist
                    </button>
                    
                    <div className={`p-3 rounded-2xl ${dark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-50 text-yellow-700'} border ${dark ? 'border-yellow-700' : 'border-yellow-200'} text-center`}>
                      <p className="text-xs font-semibold">⚠️ Removal is permanent and cannot be undone</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
