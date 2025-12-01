import api from "./api";

const floristService = {
  // Florist application
  apply: (payload) => api.post("/florists/apply", payload).then(r => r.data),
  getMyApplication: () => api.get("/florists/status").then(r => r.data),
  pendingApplications: () => api.get("/admin/florists").then(r => r.data), // admin view

  // Florist products
  getMyProducts: () => api.get("/products/mine").then(r => r.data),
  addProduct: (payload) => api.post("/products", payload).then(r => r.data),
  editProduct: (id, payload) => api.put(`/products/${id}`, payload).then(r => r.data),

  // Orders
  getOrdersReceived: () => api.get("/orders/received").then(r => r.data),
  getOrderDetails: (id) => api.get(`/orders/${id}`).then(r => r.data),

  // Earnings
  getEarnings: () => api.get("/wallet/balance").then(r => r.data),
  
  // Profile
  getProfile: () => api.get("/user/me").then(r => r.data),
};

export default floristService;
