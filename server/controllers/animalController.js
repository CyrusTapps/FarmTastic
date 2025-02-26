const Animal = require("../models/animalModel");
const User = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
const Transaction = require("../models/transactionModel");

console.log("Initializing animal controller...");

// Get all animals for the current user
exports.getAnimals = async (req, res) => {
  try {
    const animals = await Animal.find({ userId: req.user.id });

    // Calculate current health for each animal
    const animalsWithCurrentHealth = animals.map((animal) => {
      const currentHealth = animal.calculateCurrentHealth();
      return {
        ...animal._doc,
        currentHealth,
      };
    });

    res.status(200).json({
      success: true,
      count: animals.length,
      data: animalsWithCurrentHealth,
    });
  } catch (error) {
    console.error("Error getting animals:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Get a single animal by ID
exports.getAnimal = async (req, res) => {
  try {
    const animal = await Animal.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!animal) {
      return res.status(404).json({
        success: false,
        error: "Animal not found",
      });
    }

    // Calculate current health
    const currentHealth = animal.calculateCurrentHealth();

    res.status(200).json({
      success: true,
      data: {
        ...animal._doc,
        currentHealth,
        marketValue: animal.marketValue,
        ageInDays: animal.ageInDays,
      },
    });
  } catch (error) {
    console.error("Error getting animal:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Create a new animal
exports.createAnimal = async (req, res) => {
  try {
    // Add user ID to the animal
    req.body.userId = req.user.id;

    // Create the animal
    const animal = await Animal.create(req.body);

    res.status(201).json({
      success: true,
      data: animal,
    });
  } catch (error) {
    console.error("Error creating animal:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Feed an animal
exports.feedAnimal = async (req, res) => {
  try {
    const { inventoryId } = req.body;

    // Find the animal
    const animal = await Animal.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!animal) {
      return res.status(404).json({
        success: false,
        error: "Animal not found",
      });
    }

    // Find the inventory item
    const inventory = await Inventory.findOne({
      _id: inventoryId,
      userId: req.user.id,
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        error: "Inventory item not found",
      });
    }

    // Use the inventory item on the animal
    const result = await inventory.useOn(animal);

    res.status(200).json({
      success: true,
      data: {
        animal: result.animal,
        inventory: result.inventory,
      },
    });
  } catch (error) {
    console.error("Error feeding animal:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

// Water an animal
exports.waterAnimal = async (req, res) => {
  try {
    // Find the animal
    const animal = await Animal.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!animal) {
      return res.status(404).json({
        success: false,
        error: "Animal not found",
      });
    }

    // Find water in inventory
    const water = await Inventory.findOne({
      type: "water",
      userId: req.user.id,
    });

    if (!water || water.quantity < 1) {
      return res.status(400).json({
        success: false,
        error: "Not enough water in inventory",
      });
    }

    // Use water on animal
    const result = await water.useOn(animal);

    res.status(200).json({
      success: true,
      data: {
        animal: result.animal,
        inventory: result.inventory,
      },
    });
  } catch (error) {
    console.error("Error watering animal:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

// Call vet for an animal
exports.callVet = async (req, res) => {
  try {
    // Find the animal
    const animal = await Animal.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!animal) {
      return res.status(404).json({
        success: false,
        error: "Animal not found",
      });
    }

    // Find the user to check currency
    const user = await User.findById(req.user.id);

    // Vet cost is based on animal type
    const vetCosts = {
      dog: 100,
      cat: 80,
      cow: 150,
      pig: 120,
      chicken: 30,
      horse: 200,
      sheep: 100,
      goat: 90,
    };

    const vetCost = vetCosts[animal.type] || 100;

    // Check if user has enough currency
    if (user.currency < vetCost) {
      return res.status(400).json({
        success: false,
        error: `Not enough currency. Vet costs ${vetCost} coins.`,
      });
    }

    // Deduct currency from user
    user.currency -= vetCost;
    await user.save();

    // Call vet for animal
    await animal.callVet();

    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: "vet",
      itemType: "animal",
      itemId: animal._id,
      itemName: animal.name || animal.type,
      amount: vetCost,
      description: `Veterinary care for ${animal.name || animal.type}`,
    });

    res.status(200).json({
      success: true,
      data: {
        animal,
        user: {
          currency: user.currency,
        },
      },
    });
  } catch (error) {
    console.error("Error calling vet:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

// Sell an animal
exports.sellAnimal = async (req, res) => {
  try {
    // Find the animal
    const animal = await Animal.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!animal) {
      return res.status(404).json({
        success: false,
        error: "Animal not found",
      });
    }

    // Calculate selling price
    const sellingPrice = animal.marketValue;

    // Find the user to update currency
    const user = await User.findById(req.user.id);

    // Add currency to user
    user.currency += sellingPrice;
    await user.save();

    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: "sell",
      itemType: "animal",
      itemId: animal._id,
      itemName: animal.name || animal.type,
      amount: sellingPrice,
      quantity: animal.quantity,
      description: `Sold ${animal.quantity} ${animal.name || animal.type}`,
    });

    // Delete the animal
    await Animal.deleteOne({ _id: animal._id });

    res.status(200).json({
      success: true,
      data: {
        sellingPrice,
        user: {
          currency: user.currency,
        },
      },
    });
  } catch (error) {
    console.error("Error selling animal:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

console.log("Animal controller initialized");
