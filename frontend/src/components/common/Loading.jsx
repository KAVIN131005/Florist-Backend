// src/components/common/Loading.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function Loading({ message = "Loading...", size = "medium" }) {
  const { dark } = useContext(ThemeContext);

  // Size variants
  const sizeStyles = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <div className={`
      w-full flex flex-col items-center justify-center py-12 px-4
      ${dark ? 'text-white' : 'text-gray-800'}
      transition-colors duration-300
    `}>
      <div className="relative flex flex-col items-center">
        {/* Main spinner */}
        <svg 
          className={`
            ${sizeStyles[size]} 
            animate-spin 
            ${dark ? 'text-pink-400' : 'text-pink-600'}
          `} 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <circle 
            className={`opacity-25 ${dark ? 'stroke-pink-200' : 'stroke-pink-300'}`} 
            cx="12" cy="12" r="10" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        
        {/* Decorative outer ring */}
        <div className={`
          absolute inset-0 rounded-full 
          border-2 border-transparent
          border-t-pink-300 border-r-pink-200/30
          animate-pulse
          ${sizeStyles[size]}
        `}></div>

        {/* Message with animated dots */}
        <div className={`
          mt-4 text-center
          ${dark ? 'text-gray-300' : 'text-gray-600'}
          font-medium tracking-wide
        `}>
          <span>{message}</span>
          <span className="inline-flex ml-1">
            <span className="animate-loadingDot1">.</span>
            <span className="animate-loadingDot2">.</span>
            <span className="animate-loadingDot3">.</span>
          </span>
        </div>
      </div>
      
      {/* Keyframe animations for dots */}
      <style jsx>{`
        @keyframes loadingDot1 {
          0%, 20% { opacity: 0; }
          40%, 100% { opacity: 1; }
        }
        @keyframes loadingDot2 {
          0%, 40% { opacity: 0; }
          60%, 100% { opacity: 1; }
        }
        @keyframes loadingDot3 {
          0%, 60% { opacity: 0; }
          80%, 100% { opacity: 1; }
        }
        .animate-loadingDot1 { animation: loadingDot1 1.5s infinite; }
        .animate-loadingDot2 { animation: loadingDot2 1.5s infinite; }
        .animate-loadingDot3 { animation: loadingDot3 1.5s infinite; }
      `}</style>
    </div>
  );
}
