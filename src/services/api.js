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

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue = [];

// Process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Add request interceptor with detailed logging
api.interceptors.request.use(
  (config) => {
    // Create a timestamp for this request
    const timestamp = new Date().toISOString();

    // Log detailed information about the request
    console.log(
      `[${timestamp}] API Request: ${config.method.toUpperCase()} ${
        config.url
      }`,
      {
        headers: config.headers.common ? { ...config.headers.common } : {},
        params: config.params,
        // Don't log request body for security
      }
    );

    // Add timestamp to the request for tracking
    config._requestTime = Date.now();

    return config;
  },
  (error) => {
    console.error("API Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor with detailed logging
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = response.config._requestTime
      ? `${Date.now() - response.config._requestTime}ms`
      : "unknown";

    // Log detailed response info
    console.log(
      `API Response: ${response.status} from ${response.config.url} (took ${duration})`,
      {
        data: response.data ? "data received" : "no data",
        size: JSON.stringify(response.data).length,
      }
    );

    return response;
  },
  async (error) => {
    // Log detailed error info
    console.error("API Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      duration: error.config?._requestTime
        ? `${Date.now() - error.config._requestTime}ms`
        : "unknown",
    });

    const originalRequest = error.config;

    // If the error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token" && // Don't retry refresh token requests
      originalRequest.url !== "/auth/me" // Don't retry /me requests to avoid loops
    ) {
      console.log("Unauthorized request - attempting to refresh token");

      // Add a flag to track refresh attempts
      if (localStorage.getItem("refreshing") === "true") {
        console.log("Already refreshing token, waiting...");
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      localStorage.setItem("refreshing", "true");

      try {
        // Try to refresh the token
        console.log("Calling refreshToken API");
        const response = await authAPI.refreshToken();

        // Check if the response contains an access token
        if (response.data && response.data.accessToken) {
          const token = response.data.accessToken;
          console.log("Token refreshed successfully");

          // Update the token
          setAuthToken(token);
          localStorage.setItem("refreshing", "false");

          // Process the queue with the new token
          processQueue(null, token);

          // Retry the original request
          return api(originalRequest);
        } else {
          console.log("Token refresh response did not contain a token");
          setAuthToken(null);
          localStorage.setItem("refreshing", "false");
          window.location.href = "/#/login";

          // Process the queue with an error
          processQueue(new Error("Token refresh failed"));
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.log("Token refresh request failed:", refreshError);
        setAuthToken(null);
        localStorage.setItem("refreshing", "false");
        window.location.href = "/#/login";

        // Process the queue with an error
        processQueue(refreshError);
        return Promise.reject(refreshError);
      }
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
