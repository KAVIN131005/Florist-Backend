import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function UserDashboard() {
  const { dark } = useContext(ThemeContext);
  const { user, hasRole } = useAuth();
  const isFlorist = hasRole("FLORIST");
  const displayName = user?.name || user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";
  
  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50'}`}>
      {/* Enhanced Header Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="relative">
              <div className="text-7xl animate-bounce transform hover:scale-110 transition-transform duration-300">👤</div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">🌟</div>
            <div className="relative">
              <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">🏡</div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <h1 className={`text-5xl md:text-6xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-6 relative`}>
              <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent animate-gradient-x">
                Welcome, {displayName}!
              </span>
            </h1>
            <div className="w-32 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-8 font-medium`}>
            🌺 {isFlorist ? "Manage your account and explore business features" : "Your personal flower shopping dashboard"}
          </p>
          

        </div>
      </div>

      {/* Florist Banner */}
      {isFlorist && (
        <div className="max-w-6xl mx-auto mb-8">
          <div className={`p-8 rounded-3xl border-2 ${dark ? 'bg-gradient-to-r from-emerald-800 to-green-800 border-emerald-600' : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'} shadow-lg`}>
            <div className="flex items-center gap-6 mb-4">
              <div className="text-6xl animate-bounce">🌸</div>
              <div>
                <h3 className={`text-2xl md:text-3xl font-bold ${dark ? 'text-white' : 'text-emerald-800'} mb-2`}>
                  Verified Florist Account
                </h3>
                <p className={`${dark ? 'text-emerald-200' : 'text-emerald-700'} text-lg`}>
                  Access your business features and manage your flower shop!
                </p>
              </div>
            </div>
            <Link 
              to="/florist/dashboard"
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${dark ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400`}
            >
              <span className="text-xl">🏪</span>
              <span>Go to Florist Dashboard</span>
            </Link>
          </div>
        </div>
      )}
      
      {/* Dashboard Cards */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Profile Card */}
          <Link 
            to="/user/profile" 
            className={`group p-8 rounded-3xl border-2 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${dark ? 'bg-gradient-to-br from-blue-800 to-indigo-800 border-blue-600 hover:border-blue-400' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-400'}`}
          >
            <div className="text-center">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">👤</div>
              <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>My Profile</h3>
              <p className={`text-sm ${dark ? 'text-blue-200' : 'text-blue-600'}`}>Manage account details</p>
            </div>
          </Link>

          {/* Cart Card */}
          <Link 
            to="/user/cart" 
            className={`group p-8 rounded-3xl border-2 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${dark ? 'bg-gradient-to-br from-purple-800 to-pink-800 border-purple-600 hover:border-purple-400' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-400'}`}
          >
            <div className="text-center">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🛒</div>
              <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>My Cart</h3>
              <p className={`text-sm ${dark ? 'text-purple-200' : 'text-purple-600'}`}>View selected items</p>
            </div>
          </Link>

          {/* Orders Card */}
          <Link 
            to="/user/orders" 
            className={`group p-8 rounded-3xl border-2 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${dark ? 'bg-gradient-to-br from-green-800 to-emerald-800 border-green-600 hover:border-green-400' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-400'}`}
          >
            <div className="text-center">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">📦</div>
              <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>My Orders</h3>
              <p className={`text-sm ${dark ? 'text-green-200' : 'text-green-600'}`}>Track your purchases</p>
            </div>
          </Link>

          {/* Apply as Florist Card - Only show if not florist/admin */}
          {!hasRole("FLORIST") && !hasRole("ADMIN") && (
            <Link 
              to="/user/become-florist" 
              className={`group p-8 rounded-3xl border-2 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${dark ? 'bg-gradient-to-br from-orange-800 to-red-800 border-orange-600 hover:border-orange-400' : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:border-orange-400'}`}
            >
              <div className="text-center">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🌺</div>
                <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>Become Florist</h3>
                <p className={`text-sm ${dark ? 'text-orange-200' : 'text-orange-600'}`}>Start your business</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className={`p-8 rounded-3xl border-2 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-xl`}>
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Your Account Overview
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Status */}
            <div className={`text-center p-6 rounded-2xl ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-4xl mb-3">✅</div>
              <h3 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>Active Account</h3>
              <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Your account is verified</p>
            </div>
            
            {/* Account Type */}
            <div className={`text-center p-6 rounded-2xl ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-4xl mb-3">{isFlorist ? '🌸' : '👤'}</div>
              <h3 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>{isFlorist ? 'Florist' : 'Customer'}</h3>
              <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{isFlorist ? 'Business account' : 'Personal account'}</p>
            </div>
            
            {/* Join Date */}
            <div className={`text-center p-6 rounded-2xl ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-4xl mb-3">📅</div>
              <h3 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>Member Since</h3>
              <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Welcome to our platform!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
