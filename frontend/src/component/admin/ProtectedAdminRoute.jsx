import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedAdminRoute = () => {
  const { user } = useSelector((state) => state.user);

  // If not logged in at all → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not admin → go to home
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If admin → render child routes
  return <Outlet />;
};

export default ProtectedAdminRoute;
