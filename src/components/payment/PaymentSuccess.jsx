import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess({ orderId }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-2">Your order <b>{orderId}</b> has been placed successfully.</p>
      <Link
        to="/user/orders"
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        View Orders
      </Link>
    </div>
  );
}
