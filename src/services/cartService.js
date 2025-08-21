// src/services/cartService.js
import api from "./api";

const cartService = {
  getCart: () => api.get("/api/cart").then(r => r.data),
  addItem: (payload) => api.post("/api/cart/items", payload).then(r => r.data),
  updateItem: (itemId, grams) => api.put(`/api/cart/items/${itemId}`, null, { params: { grams } }).then(r => r.data),
  removeItem: (itemId) => api.delete(`/api/cart/items/${itemId}`).then(r => r.data),
  clearCart: () => api.delete("/api/cart").then(r => r.data).catch(() => null),
};

export default cartService;
