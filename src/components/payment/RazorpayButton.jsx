import React from "react";
import axios from "axios";

export default function RazorpayButton({ orderId, amount, onSuccess, onFailure }) {
  const handlePayment = async () => {
    try {
      // 1. Create Razorpay order from backend
      const { data } = await axios.post("/api/payment/create-order", { amount });
      const { id: razorpayOrderId, currency } = data;

      // 2. Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from .env
        amount: amount * 100,
        currency,
        name: "Florist E-commerce",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // 3. Verify payment in backend
            const verifyRes = await axios.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });

            if (verifyRes.data.success) {
              onSuccess(verifyRes.data);
            } else {
              onFailure("Payment verification failed");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            onFailure("Error verifying payment");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      onFailure("Payment initiation failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
    >
      Pay ₹{amount}
    </button>
  );
}
