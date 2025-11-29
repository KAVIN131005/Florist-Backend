import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function FloristDashboard() {
  const { dark } = useContext(ThemeContext);
  
  return (
    <div className={`
      p-6 md:p-8 lg:p-10 space-y-8 
      ${dark ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-pink-50 to-white text-gray-800'}
      min-h-[calc(100vh-4rem)] transition-colors duration-300
    `}>
      <h1 className={`
        text-3xl md:text-4xl font-bold 
        ${dark ? 'text-pink-200' : 'text-pink-600'} 
        relative inline-block
        after:content-[""] after:absolute after:w-1/2 after:h-1
        after:bg-pink-400 after:bottom-[-8px] after:left-0
        after:rounded-full
      `}>
        Florist Dashboard
      </h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/florist/products"
          className={`
            py-6 md:py-8 px-4 rounded-xl text-center 
            shadow-lg hover:shadow-xl transform transition-all duration-300 
            hover:-translate-y-1 hover:scale-[1.02]
            ${dark ? 'bg-gradient-to-br from-green-800 to-green-900 text-white' : 'bg-gradient-to-br from-green-500 to-green-600 text-white'}
            relative overflow-hidden group
          `}
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent to-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
          <div className="text-xl md:text-2xl font-semibold mb-2">My Products</div>
          <div className={`text-sm ${dark ? 'text-green-200' : 'text-green-100'}`}>Manage your product inventory</div>
        </Link>
        
        <Link
          to="/florist/products/add"
          className={`
            py-6 md:py-8 px-4 rounded-xl text-center 
            shadow-lg hover:shadow-xl transform transition-all duration-300 
            hover:-translate-y-1 hover:scale-[1.02]
            ${dark ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-white' : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'}
            relative overflow-hidden group
          `}
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent to-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
          <div className="text-xl md:text-2xl font-semibold mb-2">Add Product</div>
          <div className={`text-sm ${dark ? 'text-blue-200' : 'text-blue-100'}`}>Create new floral offerings</div>
        </Link>
        
        <Link
          to="/florist/earnings"
          className={`
            py-6 md:py-8 px-4 rounded-xl text-center 
            shadow-lg hover:shadow-xl transform transition-all duration-300 
            hover:-translate-y-1 hover:scale-[1.02]
            ${dark ? 'bg-gradient-to-br from-emerald-800 to-emerald-900 text-white' : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'}
            relative overflow-hidden group
          `}
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent to-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
          <div className="text-xl md:text-2xl font-semibold mb-2">Earnings</div>
          <div className={`text-sm ${dark ? 'text-emerald-200' : 'text-emerald-100'}`}>Track your revenue and performance</div>
        </Link>
      </section>
      
      <section className={`
        mt-8 p-6 rounded-lg 
        ${dark ? 'bg-gray-800 bg-opacity-50' : 'bg-white'}
        shadow-md transition-colors duration-300
      `}>
        <h2 className={`text-xl font-semibold mb-4 ${dark ? 'text-pink-200' : 'text-pink-600'}`}>
          Quick Tips
        </h2>
        <ul className={`list-disc pl-5 space-y-2 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
          <li>Add high-quality images to increase product appeal</li>
          <li>Update your inventory regularly to reflect seasonal availability</li>
          <li>Respond promptly to customer inquiries for better reviews</li>
          <li>Monitor your earnings to track best-selling products</li>
        </ul>
      </section>
    </div>
  );
}
