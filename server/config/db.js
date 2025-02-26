const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log(
      `MongoDB URI: ${process.env.MONGO_URI ? "Configured" : "Missing"}`
    );

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
    console.log(`✅ MongoDB Host: ${conn.connection.host}`);
    console.log(`✅ MongoDB Database Name: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error(`❌ Error Message: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
