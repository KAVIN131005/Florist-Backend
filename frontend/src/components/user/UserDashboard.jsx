import React from "react";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <Link to="/user/profile" className="p-4 bg-white shadow rounded-xl hover:shadow-lg">
          Profile
        </Link>
        <Link to="/user/cart" className="p-4 bg-white shadow rounded-xl hover:shadow-lg">
          My Cart
        </Link>
        <Link to="/user/orders" className="p-4 bg-white shadow rounded-xl hover:shadow-lg">
          Orders
        </Link>

        <Link to="/user/become-florist" className="p-4 bg-white shadow rounded-xl hover:shadow-lg">
          Apply as Florist
        </Link>
      </div>
    </div>
  );
}
