const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

console.log("Initializing User Schema...");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    farmName: {
      type: String,
      default: function () {
        return `${this.username}'s Farm`;
      },
      trim: true,
    },
    currency: {
      type: Number,
      default: 1000, // Start with 1000 coins
      min: 0,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

console.log("Setting up password encryption middleware...");
// Encrypt password before saving
userSchema.pre("save", async function (next) {
  console.log("Pre-save hook triggered for user");

  if (!this.isModified("password")) {
    console.log("Password not modified, skipping encryption");
    return next();
  }

  console.log("Encrypting password...");
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password encrypted successfully");
    next();
  } catch (error) {
    console.error("Error encrypting password:", error);
    next(error);
  }
});

console.log("Setting up password comparison method...");
// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("Comparing passwords...");
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log(`Password match result: ${isMatch}`);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
};

console.log("Setting up token generation methods...");
// Generate access token
userSchema.methods.generateAccessToken = function () {
  console.log("Generating access token...");
  try {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    console.log("Access token generated successfully");
    return token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  console.log("Generating refresh token...");
  try {
    const token = jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    });
    console.log("Refresh token generated successfully");
    return token;
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw error;
  }
};

console.log("Creating User model...");
const User = mongoose.model("User", userSchema);
console.log("User model created successfully");

module.exports = User;
