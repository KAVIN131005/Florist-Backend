// src/services/cartService.js
import api from "./api";

const cartService = {
  getCart: () => api.get("/cart").then(r => r.data),
  addItem: (payload) => api.post("/cart/items", payload).then(r => r.data),
  updateItem: (itemId, payload) => api.put(`/cart/items/${itemId}`, payload).then(r => r.data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`).then(r => r.data),
  clearCart: () => api.delete("/cart").then(r => r.data).catch(() => null),
};

export default cartService;
