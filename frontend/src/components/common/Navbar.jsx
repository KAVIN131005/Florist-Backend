// src/components/common/Navbar.jsx
import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useCart";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  const { dark, toggle } = useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // redirect to login after logout
  };

  return (
  <nav className={`
    ${dark ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-white via-gray-50 to-gray-100 text-gray-800'} 
    shadow-lg transition-all duration-300
  `}> 
      <div className="container mx-auto flex flex-wrap justify-between items-center p-4">
        <Link 
          to="/" 
          className={`
            text-2xl md:text-3xl font-bold flex items-center gap-2
            ${dark ? 'text-pink-300 hover:text-pink-200' : 'text-pink-600 hover:text-pink-700'} 
            transition-all duration-300 transform hover:scale-105
          `}
        >
          <span className="text-3xl md:text-4xl animate-pulse">🌸</span> 
          <span className="font-serif tracking-wide">Florist Paradise</span>
        </Link>

      <div className={`
        flex flex-wrap space-x-1 md:space-x-4 items-center
        py-2 px-2 md:px-4 rounded-full my-2
        ${dark ? 'bg-gray-700 bg-opacity-50' : 'bg-white bg-opacity-80'} 
        shadow-inner
      `}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-full transition-all duration-300 ${
                isActive 
                  ? `font-semibold ${dark ? 'bg-pink-800 text-pink-100' : 'bg-pink-100 text-pink-800'}` 
                  : `hover:bg-opacity-30 ${dark ? 'hover:bg-pink-900 text-gray-100' : 'hover:bg-pink-50 text-gray-700'}`
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `px-3 py-2 rounded-full transition-all duration-300 ${
                isActive 
                  ? `font-semibold ${dark ? 'bg-pink-800 text-pink-100' : 'bg-pink-100 text-pink-800'}` 
                  : `hover:bg-opacity-30 ${dark ? 'hover:bg-pink-900 text-gray-100' : 'hover:bg-pink-50 text-gray-700'}`
              }`
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-3 py-2 rounded-full transition-all duration-300 ${
                isActive 
                  ? `font-semibold ${dark ? 'bg-pink-800 text-pink-100' : 'bg-pink-100 text-pink-800'}` 
                  : `hover:bg-opacity-30 ${dark ? 'hover:bg-pink-900 text-gray-100' : 'hover:bg-pink-50 text-gray-700'}`
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-3 py-2 rounded-full transition-all duration-300 ${
                isActive 
                  ? `font-semibold ${dark ? 'bg-pink-800 text-pink-100' : 'bg-pink-100 text-pink-800'}` 
                  : `hover:bg-opacity-30 ${dark ? 'hover:bg-pink-900 text-gray-100' : 'hover:bg-pink-50 text-gray-700'}`
              }`
            }
          >
            Contact
          </NavLink>
          
          {/* Cart is available to everyone */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative px-3 py-2 rounded-full transition-all duration-300 ${
                isActive 
                  ? `font-semibold ${dark ? 'bg-pink-800 text-pink-100' : 'bg-pink-100 text-pink-800'}` 
                  : `hover:bg-opacity-30 ${dark ? 'hover:bg-pink-900 text-gray-100' : 'hover:bg-pink-50 text-gray-700'}`
              }`
            }
          >
            <span>Cart</span>
            {cartCount > 0 && (
              <span
                aria-label={`Items in cart: ${cartCount}`}
                className={`
                  ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5
                  text-xs font-bold rounded-full align-middle
                  ${dark ? 'bg-pink-300 text-pink-900' : 'bg-pink-600 text-white'}
                  animate-pulse
                `}
              >
                {cartCount}
              </span>
            )}
          </NavLink>

          {isAuthenticated() ? (
            <>
              {/* Role-based Dashboard Links - Show highest priority role only */}
              {user.roles.includes("ADMIN") && (
                <NavLink 
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-full transition-all duration-300 ${
                      isActive 
                        ? `font-semibold ${dark ? 'bg-pink-800 text-pink-100' : 'bg-pink-100 text-pink-800'}` 
                        : `hover:bg-opacity-30 ${dark ? 'hover:bg-pink-900 text-gray-100' : 'hover:bg-pink-50 text-gray-700'}`
                    }`
                  }
                >
                  Admin Dashboard
                </NavLink>
              )}
              
              {/* Show Florist Dashboard if user has FLORIST role (even if they also have USER role) */}
              {user.roles.includes("FLORIST") && !user.roles.includes("ADMIN") && (
                <NavLink 
                  to="/florist/dashboard"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-full transition-all duration-300 ${
                      isActive 
                        ? `font-semibold ${dark ? 'bg-pink-800 text-pink-100' : 'bg-pink-100 text-pink-800'}` 
                        : `hover:bg-opacity-30 ${dark ? 'hover:bg-pink-900 text-gray-100' : 'hover:bg-pink-50 text-gray-700'}`
                    }`
                  }
                >
                  Florist Dashboard
                </NavLink>
              )}
              
              {/* Show User Dashboard for florists AND regular users (not admins) */}
              {!user.roles.includes("ADMIN") && user.roles.includes("USER") && (
                <NavLink 
                  to="/user/dashboard"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-full transition-all duration-300 ${
                      isActive 
                        ? `font-semibold ${dark ? 'bg-pink-800 text-pink-100' : 'bg-pink-100 text-pink-800'}` 
                        : `hover:bg-opacity-30 ${dark ? 'hover:bg-pink-900 text-gray-100' : 'hover:bg-pink-50 text-gray-700'}`
                    }`
                  }
                >
                    Dashboard
                  </NavLink>
              )}
              
              <NavLink 
                to="/user/orders"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full transition-all duration-300 ${
                    isActive 
                      ? `font-semibold ${dark ? 'bg-pink-800 text-pink-100' : 'bg-pink-100 text-pink-800'}` 
                      : `hover:bg-opacity-30 ${dark ? 'hover:bg-pink-900 text-gray-100' : 'hover:bg-pink-50 text-gray-700'}`
                  }`
                }
              >
                Orders
              </NavLink>
              
              {/* Theme Toggle Pill */}
              <button
                type="button"
                onClick={toggle}
                className={`
                  relative w-16 h-7 rounded-full 
                  transition-all duration-500 ease-in-out
                  ${dark ? 'bg-gray-600 shadow-inner' : 'bg-pink-100 shadow'} 
                  flex items-center px-1 ml-2
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400
                  hover:shadow-lg
                `}
                title="Toggle theme"
              >
                <span className={`
                  absolute h-6 w-6 rounded-full shadow transform transition-all duration-500 ease-in-out
                  ${dark 
                    ? 'translate-x-9 bg-pink-300' 
                    : 'translate-x-0 bg-white'
                  }
                `}></span>
                <span className="flex justify-between w-full text-[10px] font-semibold z-10 select-none">
                  <span className={`transition-opacity duration-300 ${dark ? 'opacity-30' : 'opacity-100'}`}>🌞</span>
                  <span className={`transition-opacity duration-300 ${dark ? 'opacity-100' : 'opacity-30'}`}>🌙</span>
                </span>
              </button>

              <button
                onClick={handleLogout}
                className={`
                  px-4 py-2 rounded-full ml-2
                  transition-all duration-300 font-medium
                  ${dark 
                    ? 'bg-red-800 hover:bg-red-700 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                  }
                  transform hover:scale-105 hover:shadow-md
                `}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink 
                to="/login"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full transition-all duration-300 ${
                    isActive 
                      ? `font-semibold ${dark ? 'bg-pink-800 text-pink-100' : 'bg-pink-100 text-pink-800'}` 
                      : `hover:bg-opacity-30 ${dark ? 'hover:bg-pink-900 text-gray-100' : 'hover:bg-pink-50 text-gray-700'}`
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink 
                to="/register"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full transition-all duration-300 ${
                    isActive 
                      ? `font-semibold ${dark ? 'bg-pink-800 text-pink-100' : 'bg-pink-100 text-pink-800'}` 
                      : `hover:bg-opacity-30 ${dark ? 'hover:bg-pink-900 text-gray-100' : 'hover:bg-pink-50 text-gray-700'}`
                  }`
                }
              >
                Register
              </NavLink>
              
              {/* Theme Toggle for non-authenticated users */}
              <button
                type="button"
                onClick={toggle}
                className={`
                  relative w-16 h-7 rounded-full 
                  transition-all duration-500 ease-in-out
                  ${dark ? 'bg-gray-600 shadow-inner' : 'bg-pink-100 shadow'} 
                  flex items-center px-1 ml-2
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400
                  hover:shadow-lg
                `}
                title="Toggle theme"
              >
                <span className={`
                  absolute h-6 w-6 rounded-full shadow transform transition-all duration-500 ease-in-out
                  ${dark 
                    ? 'translate-x-9 bg-pink-300' 
                    : 'translate-x-0 bg-white'
                  }
                `}></span>
                <span className="flex justify-between w-full text-[10px] font-semibold z-10 select-none">
                  <span className={`transition-opacity duration-300 ${dark ? 'opacity-30' : 'opacity-100'}`}>🌞</span>
                  <span className={`transition-opacity duration-300 ${dark ? 'opacity-100' : 'opacity-30'}`}>🌙</span>
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
