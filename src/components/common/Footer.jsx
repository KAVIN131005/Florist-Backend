// src/components/common/Footer.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function Footer() {
  const { dark } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`
      py-8 mt-8 shadow-inner transition-colors duration-300
      ${dark ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-white via-gray-50 to-gray-100 text-gray-800'}
    `}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className={`
              text-xl md:text-2xl font-bold flex items-center gap-2
              ${dark ? 'text-pink-300 hover:text-pink-200' : 'text-pink-600 hover:text-pink-700'} 
              transition-all duration-300
            `}>
              <span className="text-2xl">🌸</span> 
              <span className="font-serif">Florist Paradise</span>
            </Link>
          </div>
          
          <div className={`
            flex flex-wrap justify-center md:justify-end gap-3 mb-6 md:mb-0
            py-2 px-4 rounded-full
            ${dark ? 'bg-gray-700 bg-opacity-50' : 'bg-white bg-opacity-80'} 
            shadow-inner
          `}>
            <Link to="/about" className={`
              px-4 py-2 rounded-full transition-all duration-300
              ${dark ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-pink-50 text-gray-700'}
            `}>
              About
            </Link>
            <Link to="/contact" className={`
              px-4 py-2 rounded-full transition-all duration-300
              ${dark ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-pink-50 text-gray-700'}
            `}>
              Contact
            </Link>
            <Link to="/shop" className={`
              px-4 py-2 rounded-full transition-all duration-300
              ${dark ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-pink-50 text-gray-700'}
            `}>
              Shop
            </Link>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`
                px-4 py-2 rounded-full transition-all duration-300
                ${dark ? 'hover:bg-pink-900/30 text-pink-200' : 'hover:bg-pink-50 text-pink-600'}
              `}
            >
              Instagram
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`
                px-4 py-2 rounded-full transition-all duration-300
                ${dark ? 'hover:bg-pink-900/30 text-pink-200' : 'hover:bg-pink-50 text-pink-600'}
              `}
            >
              Facebook
            </a>
          </div>
        </div>
        
        <div className="border-t mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className={dark ? 'text-gray-400' : 'text-gray-600'}>
            © {currentYear} Florist Paradise. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className={`
              text-sm ${dark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}
            `}>
              Privacy Policy
            </Link>
            <Link to="/terms" className={`
              text-sm ${dark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}
            `}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
