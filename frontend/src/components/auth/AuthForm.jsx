import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AuthForm({ type, onSubmit, loading }) {
  const isLogin = type === "login";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
  <div className="max-w-md w-full mx-auto relative z-10 animate-slide-in-up">
      {/* Glass Card Effect */}
      <div className="backdrop-blur-glass border border-white/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden transform hover:scale-105 transition-all duration-500 animate-glow-border">
        {/* Card Header Gradient */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 animate-gradient-x"></div>
        
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-4 shadow-lg animate-float-gentle">
            <span className="text-3xl text-white animate-sparkle">{isLogin ? '🌿' : '🌸'}</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 text-shadow-sm">
            {isLogin ? "Welcome Back" : "Join Our Flowers"}
          </h2>
          <p className="text-gray-600 text-sm">
            {isLogin ? "Sign in to your beautiful flower collection" : "Create your blooming account"}
          </p>
        </div>
        <form className="space-y-8" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider group-focus-within:text-emerald-700 transition-all duration-300">
                <span className="inline-flex items-center gap-3 text-xs">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">👤</span>
                  Full Name
                </span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Enter your full name"
                  className="w-full px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200/60 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50 focus:bg-white focus:shadow-lg transition-all duration-500 placeholder-gray-400 text-gray-800 font-medium text-lg hover:border-emerald-300 hover:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 group-focus-within:text-emerald-500 group-focus-within:scale-110 transition-all duration-300 text-xl">✨</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full"></div>
              </div>
            </div>
          )}

          <div className="group">
            <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider group-focus-within:text-emerald-700 transition-all duration-300">
              <span className="inline-flex items-center gap-3 text-xs">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">📧</span>
                Email Address
              </span>
            </label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                className="w-full px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200/60 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50 focus:bg-white focus:shadow-lg transition-all duration-500 placeholder-gray-400 text-gray-800 font-medium text-lg hover:border-emerald-300 hover:shadow-md"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-gray-400 group-focus-within:text-emerald-500 group-focus-within:scale-110 transition-all duration-300 text-xl">💌</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full"></div>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider group-focus-within:text-emerald-700 transition-all duration-300">
              <span className="inline-flex items-center gap-3 text-xs">
                <span className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">🔐</span>
                Password
              </span>
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your secure password"
                className="w-full px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200/60 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50 focus:bg-white focus:shadow-lg transition-all duration-500 placeholder-gray-400 text-gray-800 font-medium text-lg hover:border-emerald-300 hover:shadow-md pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-500 hover:scale-110 transition-all duration-300 z-10"
              >
                <span className="text-xl p-1 rounded-lg hover:bg-emerald-50">{showPassword ? '🙈' : '👁️'}</span>
              </button>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full"></div>
            </div>
          </div>

          {/* Premium Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white py-5 px-8 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-emerald-500/25 btn-float-effect disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden transform hover:scale-[1.02] transition-all duration-500"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="animate-pulse">Processing your request...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl group-hover:animate-bounce group-hover:scale-110 transition-all duration-300">{isLogin ? '🚀' : '🌱'}</span>
                    <span className="tracking-wide">{isLogin ? "Sign In to Flowers" : "Create Your Account"}</span>
                    <span className="text-xl opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
                  </>
                )}
              </span>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
            </button>
          </div>
        </form>
        {/* Premium Footer */}
        <div className="mt-10 text-center">
          {/* Elegant Divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent w-20"></div>
            <div className="mx-4">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent w-20"></div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
            <p className="text-gray-700 text-base font-medium leading-relaxed">
              {isLogin ? (
                <>
                  <span className="text-gray-500">New to our flowers?</span>
                  <br />
                  <Link 
                    to="/register" 
                    className="inline-flex items-center gap-2 mt-2 font-bold text-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-green-700 transition-all duration-500 hover:scale-105 group"
                  >
                    <span className="group-hover:animate-bounce">🌺</span>
                    Create Your Account
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-gray-500">Already part of our flowers?</span>
                  <br />
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-2 mt-2 font-bold text-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-green-700 transition-all duration-500 hover:scale-105 group"
                  >
                    <span className="group-hover:animate-bounce">🌿</span>
                    Sign In Now
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Premium Decorative Elements */}
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-80 animate-ping shadow-lg"></div>
        <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-gradient-to-tr from-pink-400 to-rose-500 rounded-full opacity-70 animate-pulse shadow-md"></div>
        <div className="absolute top-1/2 -left-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-1/4 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  );
}
