// src/services/adminService.js
import api from "./api";
const adminService = {
  // Users
  getUsers: () => api.get("/admin/users").then(r => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then(r => r.data),

  // Florists
  getFloristApplications: () => api.get("/admin/florists").then(r => r.data),
  approveFlorist: (id) => api.post(`/admin/florists/${id}/approve`).then(r => r.data),
  rejectFlorist: (id) => api.post(`/admin/florists/${id}/reject`).then(r => r.data),

  // Orders (admin)
  getAllOrders: () => api.get("/admin/orders").then(r => r.data).catch(() => []),
  getOrder: (id) => api.get(`/admin/orders/${id}`).then(r => r.data),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }).then(r => r.data),
  // ✅ Add pending applications method
getPendingFloristApplications: () => api.get("/admin/florists/pending").then(r => r.data),




  // Categories
  getCategories: () => api.get("/admin/categories").then(r => r.data),
  createCategory: (name, description) => api.post("/admin/categories", null, { params: { name, description } }).then(r => r.data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`).then(r => r.data),
 getPlatformStats: () => api.get("/admin/stats").then(r => r.data),


};

export default adminService;

