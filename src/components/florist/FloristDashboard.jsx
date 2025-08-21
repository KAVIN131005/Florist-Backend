import React from "react";
import { Link } from "react-router-dom";

export default function FloristDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Florist Dashboard</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/florist/products"
          className="bg-green-600 text-white py-4 rounded text-center shadow hover:opacity-95"
        >
          My Products
        </Link>
        <Link
          to="/florist/products/add"
          className="bg-blue-600 text-white py-4 rounded text-center shadow hover:opacity-95"
        >
          Add Product
        </Link>
        <Link
          to="/florist/earnings"
          className="bg-emerald-600 text-white py-4 rounded text-center shadow hover:opacity-95"
        >
          Earnings
        </Link>
      </section>
    </div>
  );
}
