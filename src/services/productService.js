// src/services/productService.js
import api from "./api";

const productService = {
  list: (params) => api.get("/api/products", { params }).then(r => r.data),
  get: (id) => api.get(`/api/products/${id}`).then(r => r.data),
  create: (payload) => api.post("/api/products", payload).then(r => r.data),
  update: (id, payload) => api.put(`/api/products/${id}`, payload).then(r => r.data),
  remove: (id) => api.delete(`/api/products/${id}`).then(r => r.data),

  // helper: get florist's products (if backend exposes /api/products/mine)
  myProducts: () => api.get("/api/products/mine").then(r => r.data),
};

export default productService;
