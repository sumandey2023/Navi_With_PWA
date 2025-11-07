import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../store";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useUserStore();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login with toast message
  if (!isAuthenticated || !user) {
    toast.warning("Please login first to access this page", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
