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
