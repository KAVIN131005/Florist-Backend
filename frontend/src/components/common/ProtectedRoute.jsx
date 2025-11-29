// src/components/common/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "./Loading";

export default function ProtectedRoute({ requireRole = null }) {
  const { loading, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireRole && !hasRole(requireRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
