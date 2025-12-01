import axios from "axios";
import { getToken, clearAuth } from "../utils/storage";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(cfg => {
  const token = getToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  res => res,
  err => {
    // Handle network errors (connection refused, etc.) silently for demo mode
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      // Don't spam console with network errors in demo mode
      const demoError = new Error(err.message);
      demoError.code = err.code;
      demoError.config = err.config;
      demoError.response = err.response;
      demoError.isNetworkError = true;
      return Promise.reject(demoError);
    }
    
    // Only clear auth on 401 if we actually sent a token
    if (err.response?.status === 401 && err.config.headers.Authorization) {
      clearAuth();
      // Redirect to login if we had a token but it was rejected
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
