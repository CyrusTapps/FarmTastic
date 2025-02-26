const rateLimit = require("express-rate-limit");

console.log("Initializing rate limiting middleware...");

// Rate limiting for login attempts
console.log("Setting up login rate limiter...");
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased to 50 for development
  // TODO: Reduce this limit to 5-10 before deployment to production
  message: {
    success: false,
    error: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    console.log(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  },
  onLimitReached: (req, res, options) => {
    console.log(`Login rate limit reached for IP: ${req.ip}`);
  },
});

// General API rate limiting
console.log("Setting up general API rate limiter...");
exports.apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    error: "Too many requests. Please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    console.log(`API rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  },
  onLimitReached: (req, res, options) => {
    console.log(`API rate limit reached for IP: ${req.ip}`);
  },
});

console.log("Rate limiting middleware initialized successfully");
