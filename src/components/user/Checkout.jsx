import React from "react";

import api from "../../services/api";

export default function Checkout() {
  const handlePayment = async () => {
    try {
      const { data } = await api.post("/api/payment/create-order", {}, { withCredentials: true });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        order_id: data.orderId,
        handler: function (response) {
          alert("Payment Successful!");
          api.post("/api/payment/verify", response, { withCredentials: true });
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>
      <button onClick={handlePayment} className="bg-green-600 text-white px-6 py-2 rounded">
        Pay with Razorpay
      </button>
    </div>
  );
}
