import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuth = () => {
      try {
        // Check for different types of authentication
        const token = localStorage.getItem("token");
        const superAdminToken = localStorage.getItem("superAdminToken");
        const authUser = localStorage.getItem("authUser");
        const citizenId = localStorage.getItem("citizenId");

        if (superAdminToken && authUser) {
          // Super Admin authentication
          const userData = JSON.parse(authUser);
          setUser({
            ...userData,
            role: "SuperAdmin",
            token: superAdminToken,
          });
        } else if (token && citizenId) {
          // Citizen authentication
          setUser({
            id: citizenId,
            role: "Citizen",
            token: token,
          });
        } else if (token) {
          // Officer authentication (assuming token without citizenId is officer)
          setUser({
            role: "Officer",
            token: token,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (when localStorage is cleared by axios interceptor)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom logout event
    window.addEventListener("logout", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("logout", handleStorageChange);
    };
  }, []);

  const login = (userData, role) => {
    setUser({ ...userData, role });
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("citizenId");
    setUser(null);

    // Dispatch custom logout event
    window.dispatchEvent(new Event("logout"));
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const getUserRole = () => {
    return user?.role;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
