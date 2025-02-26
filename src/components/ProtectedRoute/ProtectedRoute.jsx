import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

console.log("Initializing ProtectedRoute component...");

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  console.log("Rendering ProtectedRoute");
  console.log("ProtectedRoute - Auth state:", {
    isAuthenticated: !!currentUser,
    isLoading: loading,
    user: currentUser ? currentUser.username : "none",
  });

  // If still loading, show loading spinner
  if (loading) {
    console.log("ProtectedRoute - Auth is loading");
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // If not authenticated and not on login page, redirect to login
  if (!currentUser) {
    console.log(
      "ProtectedRoute - User not authenticated, redirecting to login"
    );

    // Only redirect if we're not already on the login page
    // This prevents the infinite loop
    if (location.pathname !== "/login") {
      return <Navigate to="/login" replace />;
    }
  }

  // If authenticated, render children
  console.log(
    "ProtectedRoute - User authenticated, rendering protected content"
  );
  return children;
};

console.log("ProtectedRoute component initialized successfully");

export default ProtectedRoute;
