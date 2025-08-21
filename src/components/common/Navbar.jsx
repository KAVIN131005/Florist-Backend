// src/components/common/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // redirect to login after logout
  };

  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold">
          🌸 FloristApp
        </Link>

        <div className="flex space-x-4 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : "hover:underline"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : "hover:underline"
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : "hover:underline"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : "hover:underline"
            }
          >
            Contact
          </NavLink>

          {isAuthenticated() ? (
            <>
              {/* User Links */}
              {user.roles.includes("USER") && (
                <>
                  <NavLink to="/user/dashboard">Dashboard</NavLink>
                  <NavLink to="/user/cart">Cart</NavLink>
                  <NavLink to="/user/orders">Orders</NavLink>
                </>
              )}

              {/* Florist Links */}
              {user.roles.includes("FLORIST") && (
                <NavLink to="/florist/dashboard">Florist Dashboard</NavLink>
              )}

              {/* Admin Links */}
              {user.roles.includes("ADMIN") && (
                <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
