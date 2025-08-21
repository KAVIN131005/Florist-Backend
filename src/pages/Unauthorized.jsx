import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-yellow-500">403</h1>
      <p className="text-gray-600 mb-6">
        You don’t have permission to access this page.
      </p>
      <Link
        to="/"
        className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600"
      >
        Back to Home
      </Link>
    </div>
  );
}
