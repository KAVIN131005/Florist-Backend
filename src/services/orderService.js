// src/services/orderService.js
import api from "./api";

const orderService = {
  createFromCart: (address) => api.post("/api/orders", { address }).then(r => r.data),
  myOrders: () => api.get("/api/orders").then(r => r.data),
  getOrder: (id) => api.get(`/api/orders/${id}`).then(r => r.data),
};

export default orderService;
