import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { isAuthenticated } from "./api";

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const auth = React.useMemo(() => isAuthenticated(), []);
  const {message, user, token} = auth 

  if (!auth) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if(user.status !== "active"){
    // console.log(auth)
    return <Navigate to="/suspended" state={{ from: location }} replace />
  }

  if (auth.user.role !== "admin" && auth.user.role !== "superAdmin") {
    // If the user is not an admin, redirect to the user dashboard (or any other page)
    return <Navigate to="/user" state={{ from: location }} replace />;
  } else if(auth.user.role !== "admin" && auth.user.role !== "user"){
     return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // If the user is an admin, render the protected content (children)
  return children;
};

export default AdminRoute;
