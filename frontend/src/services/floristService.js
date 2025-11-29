import api from "./api";

const floristService = {
  // Florist application
  apply: (payload) => api.post("/api/florists/apply", payload).then(r => r.data),
  getMyApplication: () => api.get("/api/florists/status").then(r => r.data),
  pendingApplications: () => api.get("/api/admin/florists").then(r => r.data), // admin view

  // Florist products
  getMyProducts: () => api.get("/api/products/mine").then(r => r.data),
  addProduct: (payload) => api.post("/api/products", payload).then(r => r.data),
  editProduct: (id, payload) => api.put(`/api/products/${id}`, payload).then(r => r.data),

  // Orders
  getOrdersReceived: () => api.get("/api/orders/received").then(r => r.data),
  getOrderDetails: (id) => api.get(`/api/orders/${id}`).then(r => r.data),

  // Earnings
  getEarnings: () => api.get("/api/wallet/balance").then(r => r.data),
  
  // Profile
  getProfile: () => api.get("/api/user/me").then(r => r.data),
};

export default floristService;
