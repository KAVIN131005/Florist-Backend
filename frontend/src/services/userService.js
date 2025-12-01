// src/services/userService.js
import api from "./api";

const userService = {
  me: () => api.get("/user/me").then(r => r.data),
  walletBalance: () => api.get("/user/wallet/balance").then(r => r.data),
  updateProfile: (payload) => api.put("/user", payload).then(r => r.data), // implement backend route if needed
};

export default userService;
