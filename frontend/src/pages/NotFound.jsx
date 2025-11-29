import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-gray-600 mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600"
      >
        Go Home
      </Link>
    </div>
  );
}
