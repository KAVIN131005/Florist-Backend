import React from "react";
import axios from "axios";

export default function RazorpayButton({ orderId, amount, onSuccess, onFailure }) {
  const handlePayment = async () => {
    try {
      const { data } = await axios.post("/api/payments/create-order", { orderId });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount * 100,
        currency: "INR",
        order_id: data.razorpayOrderId,
        name: "Florist Shop",
        description: "Order Payment",
        handler: async (response) => {
          try {
            await axios.post("/api/payments/verify", {
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            onSuccess();
          } catch (err) {
            onFailure(err.message);
          }
        },
        prefill: { name: "Customer", email: "customer@example.com", contact: "9999999999" },
        theme: { color: "#2563eb" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      onFailure(err.message);
    }
  };

  return <button onClick={handlePayment} className="px-6 py-2 bg-blue-600 text-white rounded">Pay ₹{amount}</button>;
}
