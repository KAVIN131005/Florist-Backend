import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import api from "../../services/api";


export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (form) => {
    try {
      setLoading(true);
        await api.post("/auth/register", form); 
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 via-rose-50 to-fuchsia-50 px-4 py-12 relative overflow-hidden">
      {/* Beautiful Flower Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400 via-pink-500 to-rose-600 rounded-full opacity-15 blur-3xl animate-pulse shadow-2xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-rose-400 via-pink-500 to-fuchsia-500 rounded-full opacity-18 blur-3xl animate-pulse shadow-xl" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-pink-300 via-purple-300 to-rose-300 rounded-full opacity-8 blur-3xl animate-spin" style={{animationDuration: '25s'}}></div>
        
        {/* Additional depth layers */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-violet-300 to-purple-400 rounded-full opacity-12 blur-2xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-tr from-fuchsia-300 to-pink-400 rounded-full opacity-10 blur-xl animate-pulse" style={{animationDelay: '3s', animationDuration: '5s'}}></div>
      </div>
      
      {/* Premium Floating Elements */}
      <div className="absolute top-20 left-20 text-7xl opacity-25 animate-bounce filter drop-shadow-lg" style={{animationDelay: '1s', animationDuration: '4s'}}>🌹</div>
      <div className="absolute top-40 right-32 text-5xl opacity-35 animate-bounce filter drop-shadow-md" style={{animationDelay: '2s', animationDuration: '5s'}}>💐</div>
      <div className="absolute bottom-32 left-32 text-6xl opacity-30 animate-bounce filter drop-shadow-lg" style={{animationDelay: '3s', animationDuration: '4.5s'}}>🌻</div>
      <div className="absolute bottom-20 right-20 text-4xl opacity-35 animate-bounce filter drop-shadow-sm" style={{animationDelay: '1.5s', animationDuration: '3.8s'}}>🌼</div>
      <div className="absolute top-1/3 left-10 text-3xl opacity-20 animate-bounce filter drop-shadow-sm" style={{animationDelay: '4s', animationDuration: '6s'}}>🌸</div>
      <div className="absolute top-2/3 right-10 text-4xl opacity-25 animate-bounce filter drop-shadow-md" style={{animationDelay: '2.5s', animationDuration: '4.2s'}}>💖</div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(236,72,153,0.3) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
      
      <AuthForm type="register" onSubmit={handleRegister} loading={loading} />
    </div>
  );
}
