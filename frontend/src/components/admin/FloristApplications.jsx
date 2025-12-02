import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function FloristApplications() {
  const { dark } = useContext(ThemeContext);
  const navigate = useNavigate();
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
    <div className={`min-h-screen flex justify-center items-center ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'}`}>
      <div className="text-center">
        <div className="relative mb-8">
          <div className={`w-20 h-20 rounded-full border-4 border-t-transparent animate-spin ${dark ? 'border-pink-400' : 'border-pink-500'}`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl animate-ping">📝</span>
          </div>
        </div>
        <p className={`text-xl font-semibold ${dark ? 'text-pink-300' : 'text-pink-600'} animate-pulse`}>
          Loading Applications...
        </p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'}`}>
      {/* Enhanced Header Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="relative">
              <div className="text-6xl animate-bounce transform hover:scale-110 transition-transform duration-300">📝</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-6xl animate-pulse transform hover:scale-110 transition-transform duration-300">🌸</div>
            <div className="relative">
              <div className="text-6xl animate-pulse transform hover:scale-110 transition-transform duration-300">⚖️</div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-4 relative`}>
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-gradient-x">
                Florist Applications
              </span>
            </h1>
            <div className="w-40 h-1 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse"></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-8 font-medium max-w-2xl mx-auto`}>
            🎯 Review and manage new vendor partnership requests with comprehensive application management
          </p>
          


          {/* Applications Summary */}
          <div className={`inline-flex items-center gap-4 px-8 py-4 rounded-3xl ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-lg`}>
            <div className="text-3xl animate-pulse">📊</div>
            <div>
              <p className={`text-2xl font-bold ${dark ? 'text-pink-400' : 'text-pink-600'}`}>
                {apps.length}
              </p>
              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                Pending Applications
              </p>
            </div>
          </div>
        </div>
        
        {/* Applications Grid */}
        {apps.length === 0 ? (
          <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden`}>
            <div className="p-16 text-center">
              <div className="text-8xl mb-8 animate-bounce">📪</div>
              <h3 className={`text-3xl font-bold ${dark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                No Pending Applications
              </h3>
              <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-500'} mb-8 max-w-md mx-auto`}>
                All florist applications have been processed. New applications will appear here for your review.
              </p>
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                <span className="animate-pulse">✅</span>
                <span className="font-semibold">All caught up!</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8">
            {apps.map((application, index) => (
              <div 
                key={application.id}
                className={`
                  ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
                  rounded-3xl border shadow-2xl overflow-hidden hover-lift relative
                  transform transition-all duration-300 hover:scale-[1.01]
                `}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x"></div>
                
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Application Info */}
                    <div className="flex-1 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-2xl ${dark ? 'bg-gradient-to-br from-pink-600 to-purple-600' : 'bg-gradient-to-br from-pink-500 to-purple-500'} flex items-center justify-center shadow-xl animate-pulse`}>
                          <span className="text-3xl filter drop-shadow-lg">🌸</span>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                            {application.shopName || application.applicant?.name || 'Unnamed Shop'}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className={`px-4 py-2 rounded-2xl text-sm font-bold ${dark ? 'bg-yellow-900 text-yellow-300 border border-yellow-700' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'} animate-pulse`}>
                              ⏳ {application.status || 'PENDING'}
                            </span>
                            
                            <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                              ID: {application.id?.toString().slice(-6) || 'N/A'}
                            </span>
                          </div>
                          
                          <div className={`p-4 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-100'} mb-6`}>
                            <h4 className={`font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
                              📝 Application Details
                            </h4>
                            <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed`}>
                              {application.description || 'No description provided'}
                            </p>
                          </div>
                          
                          {/* Additional Info Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {application.applicant?.email && (
                              <div className={`p-4 rounded-2xl ${dark ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-700'} border ${dark ? 'border-blue-700' : 'border-blue-100'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm">📧</span>
                                  <span className="text-xs font-semibold">Contact</span>
                                </div>
                                <p className="text-sm font-medium">{application.applicant.email}</p>
                              </div>
                            )}
                            
                            {application.createdAt && (
                              <div className={`p-4 rounded-2xl ${dark ? 'bg-purple-900 text-purple-200' : 'bg-purple-50 text-purple-700'} border ${dark ? 'border-purple-700' : 'border-purple-100'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm">📅</span>
                                  <span className="text-xs font-semibold">Submitted</span>
                                </div>
                                <p className="text-sm font-medium">
                                  {new Date(application.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4 lg:min-w-[200px]">
                      <button 
                        onClick={() => navigate(`/admin/applications/${application.id}`)} 
                        className={`
                          px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl
                          ${dark ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800' : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'}
                          flex items-center justify-center gap-3
                        `}
                      >
                        <span className="text-xl">👁️</span>
                        View Details
                      </button>
                      
                      <button 
                        onClick={() => approve(application.id)} 
                        className={`
                          px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl
                          ${dark ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'}
                          flex items-center justify-center gap-3
                        `}
                      >
                        <span className="text-xl">✅</span>
                        Approve
                      </button>
                      
                      <button 
                        onClick={() => reject(application.id)} 
                        className={`
                          px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl
                          ${dark ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'}
                          flex items-center justify-center gap-3
                        `}
                      >
                        <span className="text-xl">❌</span>
                        Reject
                      </button>
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
