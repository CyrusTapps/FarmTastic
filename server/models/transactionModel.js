const mongoose = require("mongoose");

console.log("Initializing transaction model...");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["buy", "sell", "vet", "use"],
      lowercase: true,
    },
    itemType: {
      type: String,
      required: true,
      enum: ["animal", "inventory"],
      lowercase: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      // Reference to either Animal or Inventory
      refPath: "itemType",
    },
    itemName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

console.log("Transaction model initialized");

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
