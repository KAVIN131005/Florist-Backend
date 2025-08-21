// src/services/authService.js
import api from "./api";
import { saveToken, saveUser, clearAuth } from "../utils/storage";

const authService = {
  register: (payload) => api.post("/api/auth/register", payload).then(r => r.data),

  login: async (payload) => {
    // backend returns JwtResponse { token, userId, name, email, roles, message }
    const res = await api.post("/api/auth/login", payload);
    const data = res.data;
    if (data?.token) {
      saveToken(data.token);
      // store minimal user fields locally
      saveUser({ id: data.userId, name: data.name, email: data.email, roles: data.roles });
    }
    return data;
  },

  logout: () => {
    clearAuth();
    return Promise.resolve();
  },

  refreshLocalUser: async () => {
    // fetch /api/user/me to refresh user object
    const res = await api.get("/api/user/me");
    saveUser(res.data);
    return res.data;
  }
};

export default authService;
