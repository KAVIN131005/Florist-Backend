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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <AuthForm type="login" onSubmit={handleLogin} loading={loading} />
    </div>
  );
}
