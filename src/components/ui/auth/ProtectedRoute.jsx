import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../../lib/auth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const authenticated = isAuthenticated();

  if (!authenticated) {
    // Redirect to the home page but save the current location they were trying to access
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
