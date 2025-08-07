import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

// Protected route for authenticated users
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, getUserRole, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated()) {
    // Redirect to appropriate login page based on the route
    const currentPath = window.location.pathname;

    if (currentPath.includes("citizen")) {
      return <Navigate to="/citizen-login" replace />;
    } else if (currentPath.includes("officer")) {
      return <Navigate to="/officer-login" replace />;
    } else if (currentPath.includes("admin")) {
      return <Navigate to="/admin-login" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Check if user has the required role
  if (allowedRoles.length > 0) {
    const userRole = getUserRole();
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on user role
      switch (userRole) {
        case "Citizen":
          return <Navigate to="/citizen-dashboard" replace />;
        case "Officer":
          return <Navigate to="/officer-dashboard" replace />;
        case "SuperAdmin":
          return <Navigate to="/admin-dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  return children;
};

// Public route that redirects authenticated users to their dashboard
export const PublicRoute = ({ children, redirectTo = null }) => {
  const { isAuthenticated, getUserRole, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated()) {
    // If redirectTo is specified, use it, otherwise redirect based on user role
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    const userRole = getUserRole();
    switch (userRole) {
      case "Citizen":
        return <Navigate to="/citizen-dashboard" replace />;
      case "Officer":
        return <Navigate to="/officer-dashboard" replace />;
      case "SuperAdmin":
        return <Navigate to="/admin-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};
