import { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import AnimalDetail from "./pages/AnimalDetail/AnimalDetail";
import "./App.css";

console.log("🔄 Initializing App component...");

function App() {
  console.log("🔄 Rendering App component");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 App - Setting up splash screen timer");
    // Simulate loading time for splash screen
    const timer = setTimeout(() => {
      console.log(
        "🔄 App - Splash screen timer complete, hiding splash screen"
      );
      setLoading(false);
    }, 2000);

    return () => {
      console.log("🔄 App - Cleaning up splash screen timer");
      clearTimeout(timer);
    };
  }, []);

  console.log("🔄 App - Current state: loading =", loading);

  // If splash screen should be shown, render it
  if (loading) {
    console.log("🔄 App - Rendering splash screen");
    return <SplashScreen />;
  }

  // Otherwise, render the main app with routing
  console.log("🔄 App - Rendering main app with routing");
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/animal/:id"
            element={
              <ProtectedRoute>
                <AnimalDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

console.log("🔄 App component initialized successfully");

export default App;
