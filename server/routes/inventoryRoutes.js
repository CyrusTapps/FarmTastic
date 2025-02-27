const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getInventory,
  getInventoryItem,
  buyInventory,
  sellInventory,
} = require("../controllers/inventoryController");

console.log("Initializing inventory routes...");

// All routes are protected
router.use(protect);

// Get all inventory items and buy new inventory
router.route("/").get(getInventory).post(buyInventory);

// Get and sell a specific inventory item
router.route("/:id").get(getInventoryItem);

router.route("/:id/sell").post(sellInventory);

console.log("Inventory routes initialized");

module.exports = router;
