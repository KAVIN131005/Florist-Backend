// src/services/categoryService.js
import api from "./api";

const categoryService = {
  all: () => api.get("/categories").then(r => r.data),
  create: (name, description) => api.post("/categories", null, { params: { name, description } }).then(r => r.data),
  delete: (id) => api.delete(`/api/categories/${id}`).then(r => r.data),
};

export default categoryService;
