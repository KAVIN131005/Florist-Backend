import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentFailure({ message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <XCircle className="text-red-500 w-16 h-16 mb-4" />
      <h1 className="text-2xl font-bold text-red-600">Payment Failed!</h1>
      <p className="mt-2 text-gray-700">{message || "Something went wrong. Please try again."}</p>
      <Link
        to="/cart"
        className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900"
      >
        Retry Payment
      </Link>
    </div>
  );
}
