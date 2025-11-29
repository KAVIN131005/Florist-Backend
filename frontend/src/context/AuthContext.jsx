/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { getToken, clearAuth } from "../utils/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get("/user/me");
      setUser(res.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setUser(null);
      clearAuth(); // remove invalid token
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials);
      const jwt = res.data.token;
      if (!jwt) throw new Error("No token received");

      localStorage.setItem("token", jwt);
      await fetchUser();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const isAuthenticated = () => !!user;
  const hasRole = (role) => user?.roles?.includes(role);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, hasRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
