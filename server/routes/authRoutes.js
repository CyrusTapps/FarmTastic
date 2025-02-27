const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  refreshToken,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { loginLimiter } = require("../middleware/rateLimitMiddleware");

console.log("Initializing authentication routes...");

const router = express.Router();

// Register route
console.log("Setting up register route: POST /api/auth/register");
router.post("/register", register);

// Login route with rate limiting
console.log("Setting up login route with rate limiting: POST /api/auth/login");
router.post("/login", loginLimiter, login);

// Logout route
console.log("Setting up logout route: POST /api/auth/logout");
router.post("/logout", logout);

// Get current user route (protected)
console.log("Setting up get current user route (protected): GET /api/auth/me");
router.get("/me", protect, getMe);

// Refresh token route
console.log("Setting up refresh token route: POST /api/auth/refresh-token");
router.post("/refresh-token", refreshToken);

console.log("Authentication routes initialized successfully");

module.exports = router;
