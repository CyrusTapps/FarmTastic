import { createContext, useState, useContext, useEffect } from "react";
import api, { setAuthToken } from "../services/api";
import { jwtDecode } from "jwt-decode";

console.log("Initializing AuthContext...");

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  console.log("Rendering AuthProvider");

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null); // Store token in state

  // Check if token exists and is valid on initial load
  useEffect(() => {
    console.log("AuthProvider - Checking for existing token");
    const checkAuth = async () => {
      try {
        // We no longer check localStorage for tokens
        // Instead, we'll rely on the token state being empty on page refresh

        // Since we're not storing tokens in localStorage, there's no token on page refresh
        console.log(
          "AuthProvider - No persistent token storage, user will need to login again"
        );
        setLoading(false);
        return;
      } catch (error) {
        console.error("AuthProvider - Error checking auth:", error);
        setError("Authentication error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      console.log("AuthProvider - Attempting login");

      // Use the API directly
      const response = await api.post("/auth/login", { email, password });
      console.log("AuthProvider - Login response received:", response.status);
      console.log(
        "AuthProvider - Login response data:",
        JSON.stringify(response.data, null, 2)
      );

      // Log the structure of the response
      console.log("AuthProvider - Response structure:", {
        hasToken: !!response.data.token,
        hasAccessToken: !!response.data.accessToken,
        hasData: !!response.data.data,
        dataHasToken: response.data.data ? !!response.data.data.token : false,
        hasUser: !!response.data.user,
        dataHasUser: response.data.data ? !!response.data.data.user : false,
      });

      // Check if the response has the expected structure
      if (!response.data) {
        console.error("AuthProvider - Empty response data");
        throw new Error("Empty response from server");
      }

      // Extract token and user from response, handling different possible structures
      let newToken = null;
      let user = null;

      if (response.data.token) {
        newToken = response.data.token;
        console.log("AuthProvider - Found token at response.data.token");
      } else if (response.data.accessToken) {
        newToken = response.data.accessToken;
        console.log("AuthProvider - Found token at response.data.accessToken");
      } else if (response.data.data && response.data.data.token) {
        newToken = response.data.data.token;
        console.log("AuthProvider - Found token at response.data.data.token");
      } else if (response.data.data && response.data.data.accessToken) {
        newToken = response.data.data.accessToken;
        console.log(
          "AuthProvider - Found token at response.data.data.accessToken"
        );
      }

      if (response.data.user) {
        user = response.data.user;
        console.log("AuthProvider - Found user at response.data.user");
      } else if (response.data.data && response.data.data.user) {
        user = response.data.data.user;
        console.log("AuthProvider - Found user at response.data.data.user");
      }

      if (!newToken) {
        console.error("AuthProvider - No token found in response");
        throw new Error("No authentication token received");
      }

      // Store token in state
      setToken(newToken);
      console.log("AuthProvider - Token saved to state");

      // Set authorization header using the imported function
      setAuthToken(newToken);
      console.log("AuthProvider - Authorization header set");

      // Set user data
      if (user) {
        setCurrentUser(user);
        console.log("AuthProvider - User data set from response:", user);
      } else {
        // If no user data in response, try to fetch it
        console.log(
          "AuthProvider - No user data in response, fetching user profile"
        );
        try {
          const userResponse = await api.get("/auth/me");
          console.log(
            "AuthProvider - User profile response:",
            userResponse.data
          );

          if (userResponse.data.data) {
            user = userResponse.data.data;
          } else {
            user = userResponse.data;
          }

          setCurrentUser(user);
          console.log("AuthProvider - User profile fetched and set:", user);
        } catch (userError) {
          console.error(
            "AuthProvider - Error fetching user profile:",
            userError
          );
          // Continue anyway since we have the token
        }
      }

      return user;
    } catch (error) {
      console.error("AuthProvider - Login error:", error);
      console.error("AuthProvider - Error details:", {
        message: error.message,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : "No response",
      });

      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      console.log("AuthProvider - Attempting registration");

      const response = await api.post("/auth/register", userData);
      console.log("AuthProvider - Registration response:", response.data);

      // Extract token and user from response, handling different possible structures
      let newToken = null;
      let user = null;

      if (response.data.token) {
        newToken = response.data.token;
        console.log("AuthProvider - Found token at response.data.token");
      } else if (response.data.accessToken) {
        newToken = response.data.accessToken;
        console.log("AuthProvider - Found token at response.data.accessToken");
      } else if (response.data.data && response.data.data.token) {
        newToken = response.data.data.token;
        console.log("AuthProvider - Found token at response.data.data.token");
      } else if (response.data.data && response.data.data.accessToken) {
        newToken = response.data.data.accessToken;
        console.log(
          "AuthProvider - Found token at response.data.data.accessToken"
        );
      }

      if (response.data.user) {
        user = response.data.user;
        console.log("AuthProvider - Found user at response.data.user");
      } else if (response.data.data && response.data.data.user) {
        user = response.data.data.user;
        console.log("AuthProvider - Found user at response.data.data.user");
      }

      if (!newToken) {
        console.error("AuthProvider - No token found in registration response");
        throw new Error("No authentication token received");
      }

      // Store token in state
      setToken(newToken);
      console.log("AuthProvider - Token saved to state");

      // Set authorization header using the imported function
      setAuthToken(newToken);
      console.log("AuthProvider - Authorization header set");

      // Set user data
      if (user) {
        setCurrentUser(user);
        console.log("AuthProvider - User data set from response:", user);
      } else {
        console.error("AuthProvider - No user data in registration response");
        throw new Error("No user data received");
      }

      return user;
    } catch (error) {
      console.error("AuthProvider - Registration error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("AuthProvider - Logging out");

      // Clear token from state
      setToken(null);

      // Remove authorization header
      setAuthToken(null);

      // Clear user data
      setCurrentUser(null);
      console.log("AuthProvider - Logout successful");
    } catch (error) {
      console.error("AuthProvider - Logout error:", error);
      setError("Logout failed. Please try again.");
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setCurrentUser(userData);
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
  };

  console.log("AuthContext initialized successfully");

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

console.log("AuthContext initialized successfully");

export default AuthContext;
