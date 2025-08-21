import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm type="register" onSubmit={handleRegister} loading={loading} />
      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
