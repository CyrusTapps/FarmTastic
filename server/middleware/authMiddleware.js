const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

console.log("Initializing authentication middleware...");

exports.protect = async (req, res, next) => {
  console.log("Authentication middleware triggered");
  console.log("Checking for authorization header...");

  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log("Bearer token found in authorization header");
    token = req.headers.authorization.split(" ")[1];
  } else {
    console.log("No bearer token found in authorization header");
  }

  // Check if token exists
  if (!token) {
    console.log("No token provided, access denied");
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }

  try {
    console.log("Verifying token...");
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Token verified successfully for user ID: ${decoded.id}`);

    // Get user from token
    console.log("Fetching user from database...");
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    console.log(`User found: ${user._id}`);
    req.user = user;

    console.log("Authentication successful, proceeding to route handler");
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    if (error.name === "JsonWebTokenError") {
      console.log("Invalid token");
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      console.log("Token expired");
      return res.status(401).json({
        success: false,
        error: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }
};
