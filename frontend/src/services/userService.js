// src/services/userService.js
import api from "./api";

const userService = {
  me: () => api.get("/api/user/me").then(r => r.data),
  walletBalance: () => api.get("/api/user/wallet/balance").then(r => r.data),
  updateProfile: (payload) => api.put("/api/user", payload).then(r => r.data), // implement backend route if needed
};

export default userService;
