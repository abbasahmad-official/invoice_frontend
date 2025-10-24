import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { isAuthenticated } from "./api";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const auth = React.useMemo(() => isAuthenticated(), []);

  if (!auth) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  // If the user is authenticated as a 'user', render the protected content (children)
  return children;
};

export default PrivateRoute;
