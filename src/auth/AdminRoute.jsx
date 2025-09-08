import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { isAuthenticated } from "./api";

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const auth = React.useMemo(() => isAuthenticated(), []);

  if (!auth) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (auth.user.role !== "admin") {
    // If the user is not an admin, redirect to the user dashboard (or any other page)
    return <Navigate to="/user" state={{ from: location }} replace />;
  }

  // If the user is an admin, render the protected content (children)
  return children;
};

export default AdminRoute;
