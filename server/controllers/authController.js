const User = require("../models/userModel");
const { sendTokenResponse } = require("../utils/jwtUtils");
const jwt = require("jsonwebtoken");

console.log("Initializing authentication controller...");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  console.log("Register endpoint called");
  console.log("Request body:", req.body);

  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();
    console.log(`Checking if email already exists: ${normalizedEmail}`);

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      console.log("User already exists with this email");
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // Create user with normalized email
    console.log("Creating new user...");
    const user = await User.create({
      username,
      email: normalizedEmail,
      password,
    });

    console.log(`User created successfully with ID: ${user._id}`);

    // Send token response
    console.log("Generating tokens and sending response...");
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error("Error in register controller:", error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  console.log("Login endpoint called");
  console.log("Request body:", {
    email: req.body.email,
    password: req.body.password ? "[FILTERED]" : undefined,
  });

  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    // Convert email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();
    console.log(`Looking up user with normalized email: ${normalizedEmail}`);

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!user) {
      console.log("User not found");
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    console.log(`User found with ID: ${user._id}`);

    // Check if password matches
    console.log("Checking password...");
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    console.log("Password matched successfully");

    // Update lastLogin time
    user.lastLogin = new Date();
    await user.save();
    console.log("Updated user's lastLogin timestamp");

    // Send token response
    console.log("Generating tokens and sending response...");
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Error in login controller:", error);
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res, next) => {
  console.log("Logout endpoint called");

  try {
    console.log("Clearing refresh token cookie...");
    res.cookie("refreshToken", "none", {
      expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
      httpOnly: true,
    });

    console.log("Refresh token cookie cleared");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in logout controller:", error);
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  console.log("Get me endpoint called");

  try {
    console.log(`Fetching user with ID: ${req.user.id}`);
    const user = await User.findById(req.user.id);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    console.log("User found, sending response");
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in getMe controller:", error);
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  console.log("Refresh token endpoint called");

  try {
    const { refreshToken } = req.cookies;
    console.log(
      `Refresh token from cookie: ${refreshToken ? "Present" : "Missing"}`
    );

    if (!refreshToken) {
      console.log("No refresh token provided");
      return res.status(401).json({
        success: false,
        error: "No refresh token provided",
      });
    }

    // Verify refresh token
    console.log("Verifying refresh token...");
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log(`Refresh token verified for user ID: ${decoded.id}`);

    // Get user
    console.log(`Fetching user with ID: ${decoded.id}`);
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("User not found");
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
    }

    console.log("User found, generating new access token");

    // Generate new access token
    const accessToken = user.generateAccessToken();

    console.log("New access token generated, sending response");
    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error("Error in refreshToken controller:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      console.log(`Token error: ${error.name}`);
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
    }

    next(error);
  }
};

console.log("Authentication controller initialized successfully");
