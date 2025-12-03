// src/services/orderService.js
import api from "./api";

// Local storage fallback helpers (when backend not implemented yet)
// Key format: orders:<userId>
const localKey = (userId) => `orders:${userId || "guest"}`;

function readLocal(userId) {
  try {
    return JSON.parse(localStorage.getItem(localKey(userId)) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(userId, orders) {
  try {
    localStorage.setItem(localKey(userId), JSON.stringify(orders));
  } catch {
    // ignore write errors
  }
}

function generateId() {
  return `loc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const LOCAL_ORDER_STATUSES = [
  "CREATED",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "FAILED",
];

const nextStatusMap = {
  CREATED: "PAID",
  PAID: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED",
};

const orderService = {
  // Backend expects just an address string - it gets cart items from the user's cart in the database
  createFromCart: (address, discount = null, shipping = null) => api.post("/orders", { address, discount, shipping }).then(r => r.data),
  
  // New method: Create order with cart items directly (bypasses database cart sync)
  createFromCartItems: (address, cartItems, discount = null, shipping = null) => {
    const payload = {
      address,
      cartItems: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      })),
      discount: discount,
      shipping: shipping
    };
    return api.post("/orders", payload).then(r => r.data);
  },
  
  myOrders: () => api.get("/orders").then(r => r.data),
  getOrder: (id) => api.get(`/orders/${id}`).then(r => r.data),

  // Fallback: create order purely on frontend (status paid if payment simulated)
  createLocalOrder: ({ userId, items, total, address, payment = { method: "RAZORPAY", status: "PAID" } }) => {
    const orders = readLocal(userId);
    const order = {
      id: generateId(),
      userId,
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        floristId: i._raw?.floristId || i._raw?.florist?.id || i.floristId,
        floristName: i.floristName || i._raw?.floristName,
      })),
      total: Number(total) || 0,
      address: address || null,
      status: payment.status === "PAID" ? "PAID" : "PENDING",
      payment,
      history: [
        { status: "CREATED", at: new Date().toISOString() },
        { status: payment.status === "PAID" ? "PAID" : "PENDING", at: new Date().toISOString() },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.unshift(order); // latest first
    writeLocal(userId, orders);
    return order;
  },

  getLocalOrders: (userId) => readLocal(userId),
  getLocalOrder: (userId, id) => readLocal(userId).find(o => o.id === id),

  advanceLocalOrderStatus: (userId, id) => {
    const orders = readLocal(userId);
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    const order = orders[idx];
    // Do not advance terminal states
    if (["DELIVERED", "CANCELLED", "FAILED"].includes(order.status)) return order;
    const next = nextStatusMap[order.status];
    if (!next) return order; // no transition defined
    order.status = next;
    order.updatedAt = new Date().toISOString();
    order.history = [...(order.history || []), { status: next, at: order.updatedAt }];
    orders[idx] = order;
    writeLocal(userId, orders);
    return order;
  },

  updateLocalOrderStatus: (userId, id, newStatus) => {
    if (!LOCAL_ORDER_STATUSES.includes(newStatus)) return null;
    const orders = readLocal(userId);
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    const order = orders[idx];
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    order.history = [...(order.history || []), { status: newStatus, at: order.updatedAt }];
    orders[idx] = order;
    writeLocal(userId, orders);
    return order;
  },
};

export default orderService;
