import axios from "axios";

console.log("Initializing API service...");

// Create an axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// We'll set up a function to update the auth token that can be called from the AuthContext
export const setAuthToken = (token) => {
  console.log("Setting auth token for API requests");
  if (token) {
    // Set token in localStorage for persistence
    localStorage.setItem("token", token);
    // Set token in axios defaults
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Remove token if null is passed
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
};

// Initialize token from localStorage if it exists
const token = localStorage.getItem("token");
if (token) {
  console.log("Found token in localStorage, initializing API with it");
  setAuthToken(token);
}

// Add request interceptor to attach the JWT token to requests
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);

    // Token should already be set in headers by setAuthToken
    if (config.headers.Authorization) {
      console.log("Request includes auth token");
    } else {
      console.log("No auth token available for request");
    }

    return config;
  },
  (error) => {
    console.error("API Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    console.log("Response data:", response.data); // Log the actual response data
    return response;
  },
  (error) => {
    console.error("API Response error:", error.response?.status, error.message);
    console.error("Error response data:", error.response?.data); // Log the error response data

    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized request - clearing token");
      setAuthToken(null);
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => {
    console.log("Calling register API with:", {
      ...userData,
      password: "[FILTERED]",
    });
    return api.post("/auth/register", userData);
  },
  login: (credentials) => {
    console.log("Calling login API with:", {
      email: credentials.email,
      password: "[FILTERED]",
    });
    return api.post("/auth/login", credentials);
  },
  logout: () => {
    console.log("Calling logout API");
    return api.post("/auth/logout");
  },
  getCurrentUser: () => {
    console.log("Calling getCurrentUser API");
    return api.get("/auth/me");
  },
  refreshToken: () => {
    console.log("Calling refreshToken API");
    return api.post("/auth/refresh-token");
  },
};

// Health check API call
export const healthAPI = {
  checkServerHealth: () => {
    console.log("Checking server health");
    return api.get("/health");
  },
};

console.log("API service initialized successfully");

// Export the api instance for other modules to use
export default api;
