import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function FloristProfile() {
  const { dark } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/me");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className={`min-h-screen flex justify-center items-center ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50'}`}>
      <div className="text-center">
        <div className="relative mb-8">
          <div className={`w-20 h-20 rounded-full border-4 border-t-transparent animate-spin ${dark ? 'border-purple-400' : 'border-purple-500'}`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl animate-ping">👤</span>
          </div>
        </div>
        <p className={`text-xl font-semibold ${dark ? 'text-purple-300' : 'text-purple-600'} animate-pulse`}>
          Loading Profile...
        </p>
      </div>
    </div>
  );

  if (!user) return (
    <div className={`min-h-screen flex justify-center items-center ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50'}`}>
      <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl p-12 text-center`}>
        <div className="text-6xl mb-6 animate-bounce">❌</div>
        <h3 className={`text-2xl font-bold ${dark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
          Profile Not Found
        </h3>
        <p className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          Unable to load your profile information.
        </p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50'}`}>
      {/* Enhanced Header Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="relative">
              <div className="text-7xl animate-bounce transform hover:scale-110 transition-transform duration-300">👤</div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">🌺</div>
            <div className="relative">
              <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">⚙️</div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-pink-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <h1 className={`text-5xl md:text-6xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-6 relative`}>
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent animate-gradient-x">
                My Profile
              </span>
            </h1>
            <div className="w-32 h-1 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-8 font-medium`}>
            🌸 Manage your florist account and business information
          </p>
          

        </div>
      </div>

      {/* Profile Information Cards */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Profile Card */}
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 animate-gradient-x"></div>
          
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Avatar Section */}
              <div className="text-center lg:text-left">
                <div className={`w-32 h-32 mx-auto lg:mx-0 rounded-3xl ${dark ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'} flex items-center justify-center shadow-2xl animate-pulse mb-6`}>
                  <span className="text-6xl filter drop-shadow-lg">👤</span>
                </div>
                
                <div className={`px-6 py-3 rounded-2xl ${dark ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'} inline-flex items-center gap-2`}>
                  <span className="animate-pulse">🌺</span>
                  <span className="font-bold text-sm">FLORIST</span>
                </div>
              </div>
              
              {/* Profile Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {user.name || 'Unknown Florist'}
                  </h2>
                  <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                    Professional Florist & Business Owner
                  </p>
                </div>
                
                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Card */}
                  <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">📧</span>
                      <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Email Address
                      </h3>
                    </div>
                    <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} font-mono text-sm`}>
                      {user.email || 'Not provided'}
                    </p>
                  </div>
                  
                  {/* Role Card */}
                  <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">👑</span>
                      <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Account Role
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(user.roles || ['FLORIST']).map((role, index) => (
                        <span key={index} className={`px-3 py-1 rounded-xl text-xs font-bold ${dark ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Account Status */}
                  <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">✅</span>
                      <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Account Status
                      </h3>
                    </div>
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold ${dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
                      ACTIVE
                    </span>
                  </div>
                  
                  {/* Member Since */}
                  <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">📅</span>
                      <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Member Since
                      </h3>
                    </div>
                    <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Date not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information Card */}
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 animate-gradient-x"></div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4 animate-bounce">🏪</div>
              <h3 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Business Information
              </h3>
              <p className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                Your florist business details and settings
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'} text-center`}>
                <div className="text-3xl mb-3 animate-pulse">🌹</div>
                <h4 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Total Products
                </h4>
                <p className={`text-2xl font-bold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
                  --
                </p>
                <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  Active listings
                </p>
              </div>
              
              <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100'} text-center`}>
                <div className="text-3xl mb-3 animate-pulse">📦</div>
                <h4 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Orders Completed
                </h4>
                <p className={`text-2xl font-bold ${dark ? 'text-purple-400' : 'text-purple-600'}`}>
                  --
                </p>
                <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  Successfully delivered
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 animate-gradient-x"></div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4 animate-bounce">⚙️</div>
              <h3 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Quick Actions
              </h3>
              <p className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your account and business settings
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className={`
                p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                ${dark ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'}
              `}>
                <div className="flex items-center gap-4">
                  <span className="text-3xl">✏️</span>
                  <div>
                    <h4 className="font-bold mb-1">Edit Profile</h4>
                    <p className="text-sm opacity-90">Update your information</p>
                  </div>
                </div>
              </button>
              
              <button className={`
                p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                ${dark ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white' : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white'}
              `}>
                <div className="flex items-center gap-4">
                  <span className="text-3xl">🔐</span>
                  <div>
                    <h4 className="font-bold mb-1">Change Password</h4>
                    <p className="text-sm opacity-90">Update security settings</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
