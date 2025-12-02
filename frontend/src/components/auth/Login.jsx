import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthForm from "./AuthForm";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated } = useAuth();

  // If already logged in, redirect away from login page
  useEffect(() => {
    if (isAuthenticated()) {
      // Prefer redirect to previous protected route if provided
      const from = location.state?.from?.pathname;
      if (from) navigate(from, { replace: true });
      else if (user?.roles?.includes('ADMIN')) navigate('/admin/dashboard', { replace: true });
      else if (user?.roles?.includes('FLORIST')) navigate('/florist/dashboard', { replace: true });
      else navigate('/user/dashboard', { replace: true });
    }
  }, [user, isAuthenticated, location, navigate]);

  const handleLogin = async (form) => {
    setLoading(true);
    const result = await login(form);
    setLoading(false);
    if (!result.success) {
      alert(result.error || 'Login failed');
      return;
    }
    // user state will trigger useEffect redirect
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 via-teal-50 to-cyan-50 px-4 py-12 relative overflow-hidden">
      {/* Beautiful Flower Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400 via-teal-500 to-green-600 rounded-full opacity-15 blur-3xl animate-pulse shadow-2xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400 via-emerald-500 to-cyan-500 rounded-full opacity-18 blur-3xl animate-pulse shadow-xl" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 rounded-full opacity-8 blur-3xl animate-spin" style={{animationDuration: '25s'}}></div>
        
        {/* Additional depth layers */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-lime-300 to-emerald-400 rounded-full opacity-12 blur-2xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-tr from-cyan-300 to-teal-400 rounded-full opacity-10 blur-xl animate-pulse" style={{animationDelay: '3s', animationDuration: '5s'}}></div>
      </div>
      
      {/* Premium Floating Elements */}
      <div className="absolute top-20 left-20 text-7xl opacity-25 animate-bounce filter drop-shadow-lg" style={{animationDelay: '1s', animationDuration: '4s'}}>🌸</div>
      <div className="absolute top-40 right-32 text-5xl opacity-35 animate-bounce filter drop-shadow-md" style={{animationDelay: '2s', animationDuration: '5s'}}>🌿</div>
      <div className="absolute bottom-32 left-32 text-6xl opacity-30 animate-bounce filter drop-shadow-lg" style={{animationDelay: '3s', animationDuration: '4.5s'}}>🌺</div>
      <div className="absolute bottom-20 right-20 text-4xl opacity-35 animate-bounce filter drop-shadow-sm" style={{animationDelay: '1.5s', animationDuration: '3.8s'}}>🌷</div>
      <div className="absolute top-1/3 left-10 text-3xl opacity-20 animate-bounce filter drop-shadow-sm" style={{animationDelay: '4s', animationDuration: '6s'}}>🍃</div>
      <div className="absolute top-2/3 right-10 text-4xl opacity-25 animate-bounce filter drop-shadow-md" style={{animationDelay: '2.5s', animationDuration: '4.2s'}}>🌻</div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(16,185,129,0.3) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
      
      <AuthForm type="login" onSubmit={handleLogin} loading={loading} />
    </div>
  );
}
