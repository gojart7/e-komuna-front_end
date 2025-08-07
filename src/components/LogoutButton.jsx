import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";
import "./LogoutButton.css";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <button onClick={handleLogout} className="modern-logout-btn" title="Logout">
      <FaSignOutAlt className="logout-icon" />
      <span>Logout</span>
    </button>
  );
}
