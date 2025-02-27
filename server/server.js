const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load environment variables
console.log("Loading environment variables...");
dotenv.config();
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Server will run on port: ${process.env.PORT || 5000}`);
console.log(`MongoDB URI: ${process.env.MONGO_URI ? "Configured" : "Missing"}`);
console.log(`JWT Secret: ${process.env.JWT_SECRET ? "Configured" : "Missing"}`);
console.log(`Client URL: ${process.env.CLIENT_URL || "Not configured"}`);

// Import routes
console.log("Setting up routes...");
const authRoutes = require("./routes/authRoutes");
const animalRoutes = require("./routes/animalRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// Initialize express app
console.log("Initializing Express app...");
const app = express();

// Middleware
console.log("Setting up middleware...");
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// Configure CORS
console.log(`Configuring CORS for origin: ${process.env.CLIENT_URL}`);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
console.log("Registering routes...");
app.use("/api/auth", authRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/transactions", transactionRoutes);
console.log(
  "Routes registered: /api/auth, /api/animals, /api/inventory, /api/transactions"
);

// Health check route
app.get("/api/health", (req, res) => {
  console.log("Health check requested");
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
console.log("Setting up error handling middleware...");
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "production" ? "Server Error" : err.message,
  });
});

// Connect to MongoDB
console.log("Connecting to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ API available at http://localhost:${PORT}/api`);
      console.log(
        `✅ Health check available at http://localhost:${PORT}/api/health`
      );
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("Full error:", err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.message);
  console.error(err);
  // Close server & exit process
  process.exit(1);
});
