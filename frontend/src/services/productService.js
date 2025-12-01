// src/services/productService.js
import api from "./api";

const productService = {
  list: (params) => api.get("/products", { params }).then(r => r.data),
  get: (id) => api.get(`/products/${id}`).then(r => r.data),
  create: (payload) => api.post("/products", payload).then(r => r.data),
  update: (id, payload) => api.put(`/products/${id}`, payload).then(r => r.data),
  remove: (id) => api.delete(`/products/${id}`).then(r => r.data),

  // helper: get florist's products (if backend exposes /products/mine)
  myProducts: () => api.get("/products/mine").then(r => r.data),
};

export default productService;
