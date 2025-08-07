import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SuperAdminLogin from "../pages/SuperAdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import Officerlogin from "../pages/OfficerLogin";
import CitizenLogin from "../pages/CitizenLogin";
import CitizenDashboard from "../pages/CitizenDashboard";
import CitizenSignUp from "../pages/CitizenSignUp";
import CitizenRequest from "../pages/CitizenRequest";
import OfficerDashboard from "../pages/OfficerDashboard";
import Subventions from "../pages/Citizen Services/Subventions";
import MeetingRequestPage from "../pages/Citizen Services/MeetingRequestPage";
import EventRequestPage from "../pages/Citizen Services/EventRequestPage";
import BirthCertificate from "../pages/BirthCertificate";
import CalendarView from "../pages/CalendarView";
import { ProtectedRoute, PublicRoute } from "../components/ProtectedRoute";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes - redirect authenticated users to their dashboard */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />
        <Route path="/citizen-signup" element={<CitizenSignUp />} />

        {/* Login routes - redirect authenticated users to their dashboard */}
        <Route
          path="/admin-login"
          element={
            <PublicRoute>
              <SuperAdminLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/officer-login"
          element={
            <PublicRoute>
              <Officerlogin />
            </PublicRoute>
          }
        />
        <Route
          path="/citizen-login"
          element={
            <PublicRoute>
              <CitizenLogin />
            </PublicRoute>
          }
        />

        {/* Protected routes - require authentication */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Officer"]}>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        {/* Citizen service routes - require citizen authentication */}
        <Route
          path="/citizen-request"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <CitizenRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subventions"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <Subventions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meeting-request"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <MeetingRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event-request"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <EventRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/birth-certificate"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <BirthCertificate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <CalendarView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
