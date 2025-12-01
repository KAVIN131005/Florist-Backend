// src/services/paymentService.js
import api from "./api";

const paymentService = {
  // Backend creates razorpay order and returns { razorpayOrderId, keyId, amount }
  createOrder: (orderId) => api.post("/payments/create-order", { orderId }).then(r => r.data),

  // Confirm success (signature verification done backend-side)
  confirmSuccess: ({ orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) =>
    api.post("/payments/success", null, {
      params: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
    }).then(r => r.data),

  // Fetch payment history (optional)
  history: () => api.get("/payments/history").then(r => r.data).catch(() => []),
};

export default paymentService;
