import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function FloristDashboard() {
  const { dark } = useContext(ThemeContext);
  
  return (
    <div className={`min-h-screen py-8 px-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50'}`}>
      {/* Enhanced Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="relative">
              <div className="text-7xl animate-bounce transform hover:scale-110 transition-transform duration-300">🌺</div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-pink-500 rounded-full animate-ping"></div>
            </div>
            <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">🏪</div>
            <div className="relative">
              <div className="text-7xl animate-pulse transform hover:scale-110 transition-transform duration-300">💼</div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <h1 className={`text-5xl md:text-6xl font-bold ${dark ? 'text-white' : 'text-gray-900'} font-serif mb-6 relative`}>
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent animate-gradient-x">
                Florist Dashboard
              </span>
            </h1>
            <div className="w-48 h-1 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
          </div>
          
          <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-xl mb-8 font-medium max-w-2xl mx-auto`}>
            🌸 Welcome to your beautiful floral business management center
          </p>

          {/* Welcome Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden hover-lift relative p-6`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 animate-gradient-x"></div>
              <div className="text-center">
                <div className="text-4xl mb-3 animate-pulse">🌹</div>
                <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-1`}>Your Products</h3>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your beautiful floral inventory</p>
              </div>
            </div>
            
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden hover-lift relative p-6`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-gradient-x"></div>
              <div className="text-center">
                <div className="text-4xl mb-3 animate-pulse">📦</div>
                <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-1`}>Orders</h3>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Track and fulfill customer orders</p>
              </div>
            </div>
            
            <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden hover-lift relative p-6`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500 animate-gradient-x"></div>
              <div className="text-center">
                <div className="text-4xl mb-3 animate-pulse">💰</div>
                <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-1`}>Earnings</h3>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Monitor your revenue growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Dashboard Actions */}
      <div className="max-w-7xl mx-auto mb-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* My Products Card */}
          <Link
            to="/florist/products"
            className={`
              ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
              rounded-3xl border shadow-2xl overflow-hidden hover-lift relative
              transform transition-all duration-300 hover:scale-[1.02] group
            `}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 animate-gradient-x"></div>
            
            <div className="p-8 text-center">
              <div className={`w-20 h-20 mx-auto rounded-3xl ${dark ? 'bg-gradient-to-br from-green-600 to-emerald-600' : 'bg-gradient-to-br from-green-500 to-emerald-500'} flex items-center justify-center shadow-xl animate-pulse mb-6`}>
                <span className="text-4xl filter drop-shadow-lg">🌹</span>
              </div>
              
              <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-3`}>
                My Products
              </h3>
              
              <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-6`}>
                Manage your beautiful floral inventory and showcase your best arrangements
              </p>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold ${dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'} group-hover:scale-105 transition-transform duration-300`}>
                <span>View Products</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>

          {/* Add Product Card */}
          <Link
            to="/florist/products/add"
            className={`
              ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
              rounded-3xl border shadow-2xl overflow-hidden hover-lift relative
              transform transition-all duration-300 hover:scale-[1.02] group
            `}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-gradient-x"></div>
            
            <div className="p-8 text-center">
              <div className={`w-20 h-20 mx-auto rounded-3xl ${dark ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'} flex items-center justify-center shadow-xl animate-pulse mb-6`}>
                <span className="text-4xl filter drop-shadow-lg">➕</span>
              </div>
              
              <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-3`}>
                Add Product
              </h3>
              
              <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-6`}>
                Create new floral offerings and expand your product catalog
              </p>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold ${dark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'} group-hover:scale-105 transition-transform duration-300`}>
                <span>Add New</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>

          {/* Orders Card */}
          <Link
            to="/florist/orders"
            className={`
              ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
              rounded-3xl border shadow-2xl overflow-hidden hover-lift relative
              transform transition-all duration-300 hover:scale-[1.02] group
            `}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 animate-gradient-x"></div>
            
            <div className="p-8 text-center">
              <div className={`w-20 h-20 mx-auto rounded-3xl ${dark ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'} flex items-center justify-center shadow-xl animate-pulse mb-6`}>
                <span className="text-4xl filter drop-shadow-lg">📦</span>
              </div>
              
              <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-3`}>
                Orders Received
              </h3>
              
              <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-6`}>
                Track and manage customer orders and deliveries
              </p>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold ${dark ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'} group-hover:scale-105 transition-transform duration-300`}>
                <span>View Orders</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>

          {/* Earnings Card */}
          <Link
            to="/florist/earnings"
            className={`
              ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
              rounded-3xl border shadow-2xl overflow-hidden hover-lift relative
              transform transition-all duration-300 hover:scale-[1.02] group
            `}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500 animate-gradient-x"></div>
            
            <div className="p-8 text-center">
              <div className={`w-20 h-20 mx-auto rounded-3xl ${dark ? 'bg-gradient-to-br from-emerald-600 to-green-600' : 'bg-gradient-to-br from-emerald-500 to-green-500'} flex items-center justify-center shadow-xl animate-pulse mb-6`}>
                <span className="text-4xl filter drop-shadow-lg">💰</span>
              </div>
              
              <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-3`}>
                Earnings
              </h3>
              
              <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-6`}>
                Track your revenue and financial performance metrics
              </p>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold ${dark ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'} group-hover:scale-105 transition-transform duration-300`}>
                <span>View Earnings</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Enhanced Tips Section */}
      <div className="max-w-4xl mx-auto">
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl border shadow-2xl overflow-hidden relative`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 animate-gradient-x"></div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4 animate-bounce">💡</div>
              <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Professional Tips for Success
              </h2>
              <p className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                Expert advice to grow your floral business
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100'}`}>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📸</div>
                  <div>
                    <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                      High-Quality Photography
                    </h3>
                    <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                      Showcase your arrangements with beautiful, well-lit photos to attract more customers
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'}`}>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">🔄</div>
                  <div>
                    <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                      Regular Inventory Updates
                    </h3>
                    <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                      Keep your product catalog fresh with seasonal flowers and trending arrangements
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100'}`}>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">💬</div>
                  <div>
                    <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                      Customer Communication
                    </h3>
                    <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                      Respond promptly to inquiries and provide excellent customer service
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-700 border border-gray-600' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100'}`}>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📊</div>
                  <div>
                    <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
                      Performance Analytics
                    </h3>
                    <p className={`${dark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                      Monitor your best-selling products and optimize your offerings accordingly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
