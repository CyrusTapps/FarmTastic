const jwt = require("jsonwebtoken");

console.log("Initializing JWT utilities...");

// Generate tokens and set cookie
const sendTokenResponse = (user, statusCode, res) => {
  console.log(`Preparing token response for user: ${user._id}`);

  try {
    // Create access token
    console.log("Generating access token...");
    const accessToken = user.generateAccessToken();
    console.log("Access token generated successfully");

    // Create refresh token
    console.log("Generating refresh token...");
    const refreshToken = user.generateRefreshToken();
    console.log("Refresh token generated successfully");

    // Set refresh token in HTTP-only cookie
    console.log("Setting refresh token cookie...");
    const refreshTokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    console.log("Cookie options:", {
      httpOnly: refreshTokenOptions.httpOnly,
      secure: refreshTokenOptions.secure,
      sameSite: refreshTokenOptions.sameSite,
      maxAge: `${refreshTokenOptions.maxAge} ms (${
        refreshTokenOptions.maxAge / (1000 * 60 * 60 * 24)
      } days)`,
    });

    res.cookie("refreshToken", refreshToken, refreshTokenOptions);
    console.log("Refresh token cookie set successfully");

    // Remove password from response
    user.password = undefined;

    console.log(`Sending response with status code: ${statusCode}`);
    res.status(statusCode).json({
      success: true,
      accessToken,
      user,
    });

    console.log("Token response sent successfully");
  } catch (error) {
    console.error("Error in sendTokenResponse:", error);
    throw error;
  }
};

module.exports = { sendTokenResponse };
