import React, { useContext } from 'react';
import { ThemeContext } from '../../context/themeContextDefinition';

export default function DemoModeNotice() {
  const { dark } = useContext(ThemeContext);
  
  return (
    <div className={`mb-4 p-4 rounded-lg border ${dark ? 'bg-blue-900 bg-opacity-20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
        <span className={`text-sm font-medium ${dark ? 'text-blue-300' : 'text-blue-700'}`}>
          🚀 Demo Mode Active
        </span>
      </div>
      <div className={`text-xs mt-1 ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
        Backend API unavailable - displaying sample data
      </div>
    </div>
  );
}