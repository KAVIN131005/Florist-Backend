import React from "react";
import { Routes, Route } from "react-router-dom";

// Common
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Auth
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// User
import UserDashboard from "./components/user/UserDashboard";
import Profile from "./components/user/Profile";
import Cart from "./components/user/Cart";
import Checkout from "./components/user/Checkout";
import Orders from "./components/user/Orders";
import OrderDetailsLocal from "./components/user/OrderDetailsLocal";
import OrderTracking from "./components/user/OrderTracking";
import BecomeFlorist from "./components/user/BecomeFlorist";

// Florist
import FloristDashboard from "./components/florist/FloristDashboard";
import FloristEarnings from "./components/florist/FloristEarnings";
import MyProducts from "./components/florist/MyProducts";
import AddProduct from "./components/florist/AddProduct";
import EditProduct from "./components/florist/EditProduct";
import OrdersReceived from "./components/florist/OrdersReceived";
import OrderDetails from "./components/florist/OrderDetails";

// Admin
import AdminDashboard from "./components/admin/AdminDashboard";
import FloristApplications from "./components/admin/FloristApplications";
import ApplicationDetails from "./components/admin/ApplicationDetails";
import AllFlorists from "./components/admin/AllFlorists";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* Public My Orders (no forced login) */}
          <Route path="/user/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderTracking />} />
          
          {/* Cart should be accessible to everyone */}
          <Route path="/user/cart" element={<Cart />} />
          <Route path="/cart" element={<Cart />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute requireRole="USER" />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} /> {/* ✅ Checkout */}
            <Route path="/user/become-florist" element={<BecomeFlorist />} />
          </Route>

          {/* Florist Protected Routes */}
          <Route element={<ProtectedRoute requireRole="FLORIST" />}>
            <Route path="/florist/dashboard" element={<FloristDashboard />} />
            <Route path="/florist/earnings" element={<FloristEarnings />} />
            <Route path="/florist/products" element={<MyProducts />} />
            <Route path="/florist/products/add" element={<AddProduct />} />
            <Route path="/florist/products/edit/:id" element={<EditProduct />} />
            <Route path="/florist/orders" element={<OrdersReceived />} />
            <Route path="/florist/orders/:id" element={<OrderDetails />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute requireRole="ADMIN" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/florist-applications" element={<FloristApplications />} />
            <Route path="/admin/applications" element={<FloristApplications />} />
            <Route path="/admin/applications/:id" element={<ApplicationDetails />} />
            <Route path="/admin/all-florists" element={<AllFlorists />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
