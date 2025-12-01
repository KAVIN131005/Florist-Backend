import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function UserDashboard() {
  const { user, hasRole } = useAuth();
  const isFlorist = hasRole("FLORIST");
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isFlorist ? "User Profile & Settings" : "User Dashboard"}
      </h1>
      
      {isFlorist && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            🌸 You're a verified florist! Access your business features through your{" "}
            <Link to="/florist/dashboard" className="font-semibold text-green-600 hover:underline">
              Florist Dashboard
            </Link>
          </p>
        </div>
      )}
      
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

        {/* Only show "Apply as Florist" if user doesn't already have FLORIST role */}
        {!hasRole("FLORIST") && !hasRole("ADMIN") && (
          <Link to="/user/become-florist" className="p-4 bg-white shadow rounded-xl hover:shadow-lg">
            Apply as Florist
          </Link>
        )}
      </div>
    </div>
  );
}
