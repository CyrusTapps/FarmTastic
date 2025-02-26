const Inventory = require("../models/inventoryModel");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");

console.log("Initializing inventory controller...");

// Get all inventory items for the current user
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({ userId: req.user.id });

    res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory,
    });
  } catch (error) {
    console.error("Error getting inventory:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Get a single inventory item by ID
exports.getInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error getting inventory item:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Buy inventory items
exports.buyInventory = async (req, res) => {
  try {
    const { type, quantity } = req.body;

    // Default inventory items with prices
    const inventoryDefaults = {
      dogFood: { name: "Dog Food", price: 20, unit: "lbs" },
      catFood: { name: "Cat Food", price: 15, unit: "lbs" },
      livestockFeed: { name: "Livestock Feed", price: 10, unit: "lbs" },
      water: { name: "Water", price: 5, unit: "gallons" },
      medicine: { name: "Medicine", price: 50, unit: "units" },
      treats: { name: "Treats", price: 10, unit: "units" },
    };

    if (!inventoryDefaults[type]) {
      return res.status(400).json({
        success: false,
        error: "Invalid inventory type",
      });
    }

    // Calculate total cost
    const itemInfo = inventoryDefaults[type];
    const totalCost = itemInfo.price * quantity;

    // Find the user to check currency
    const user = await User.findById(req.user.id);

    // Check if user has enough currency
    if (user.currency < totalCost) {
      return res.status(400).json({
        success: false,
        error: `Not enough currency. Total cost: ${totalCost} coins.`,
      });
    }

    // Find existing inventory item or create new one
    let inventoryItem = await Inventory.findOne({
      userId: req.user.id,
      type,
    });

    if (inventoryItem) {
      // Update existing inventory
      inventoryItem.quantity += quantity;
      await inventoryItem.save();
    } else {
      // Create new inventory item
      inventoryItem = await Inventory.create({
        userId: req.user.id,
        type,
        name: itemInfo.name,
        quantity,
        unit: itemInfo.unit,
        price: itemInfo.price,
      });
    }

    // Deduct currency from user
    user.currency -= totalCost;
    await user.save();

    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: "buy",
      itemType: "inventory",
      itemId: inventoryItem._id,
      itemName: inventoryItem.name,
      amount: totalCost,
      quantity,
      description: `Bought ${quantity} ${inventoryItem.unit} of ${inventoryItem.name}`,
    });

    res.status(200).json({
      success: true,
      data: {
        inventory: inventoryItem,
        user: {
          currency: user.currency,
        },
      },
    });
  } catch (error) {
    console.error("Error buying inventory:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

// Sell inventory items
exports.sellInventory = async (req, res) => {
  try {
    const { quantity } = req.body;

    // Find the inventory item
    const inventoryItem = await Inventory.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        error: "Inventory item not found",
      });
    }

    // Check if there's enough quantity to sell
    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: `Not enough inventory. You have ${inventoryItem.quantity} ${inventoryItem.unit}.`,
      });
    }

    // Calculate selling price (80% of purchase price)
    const sellingPrice = Math.round(inventoryItem.price * quantity * 0.8);

    // Find the user to update currency
    const user = await User.findById(req.user.id);

    // Add currency to user
    user.currency += sellingPrice;
    await user.save();

    // Update inventory quantity
    inventoryItem.quantity -= quantity;

    // If quantity is 0, remove the item
    if (inventoryItem.quantity === 0) {
      await Inventory.deleteOne({ _id: inventoryItem._id });
    } else {
      await inventoryItem.save();
    }

    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: "sell",
      itemType: "inventory",
      itemId: inventoryItem._id,
      itemName: inventoryItem.name,
      amount: sellingPrice,
      quantity,
      description: `Sold ${quantity} ${inventoryItem.unit} of ${inventoryItem.name}`,
    });

    res.status(200).json({
      success: true,
      data: {
        sellingPrice,
        inventory: inventoryItem.quantity > 0 ? inventoryItem : null,
        user: {
          currency: user.currency,
        },
      },
    });
  } catch (error) {
    console.error("Error selling inventory:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

console.log("Inventory controller initialized");
