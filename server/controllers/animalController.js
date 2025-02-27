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

    // Set category based on animal type
    if (
      req.body.type === "dog" ||
      req.body.type === "cat" ||
      req.body.type === "horse"
    ) {
      req.body.category = "pet";
    } else {
      req.body.category = "livestock";
    }

    // Get the price from the request body
    const { price } = req.body;
    console.log(`Animal purchase - Price: ${price}`);

    // Find the user to check and update currency
    const user = await User.findById(req.user.id);
    console.log(
      `User before purchase - ID: ${user._id}, Currency: ${user.currency}`
    );

    // Check if user has enough currency
    if (user.currency < price) {
      return res.status(400).json({
        success: false,
        error: `Not enough currency. Animal costs ${price} coins.`,
      });
    }

    // Create the animal
    const animal = await Animal.create(req.body);
    console.log(
      `Animal created - ID: ${animal._id}, Type: ${animal.type}, Name: ${animal.name}`
    );

    // Deduct currency from user
    const oldCurrency = user.currency;
    user.currency -= price;
    console.log(`Currency update - Old: ${oldCurrency}, New: ${user.currency}`);

    // Save user with updated currency
    const savedUser = await user.save();
    console.log(`User saved - Currency after save: ${savedUser.currency}`);

    // Create transaction record
    const transaction = await Transaction.create({
      userId: req.user.id,
      type: "buy",
      itemType: "animal",
      itemId: animal._id,
      itemName: animal.name || animal.type,
      amount: price,
      quantity: 1,
      description: `Bought ${animal.name || animal.type}`,
    });
    console.log(
      `Transaction created - ID: ${transaction._id}, Amount: ${transaction.amount}`
    );

    res.status(201).json({
      success: true,
      data: {
        animal,
        user: {
          currency: user.currency,
        },
      },
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
    const { foodId } = req.body;

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

    // Find the food in inventory
    const foodItem = await Inventory.findOne({
      _id: foodId,
      userId: req.user.id,
      quantity: { $gt: 0 },
    });

    if (!foodItem) {
      return res.status(400).json({
        success: false,
        error: "Food not found in your inventory",
      });
    }

    // Check if the food is appropriate for this animal type
    const validFoodMap = {
      dog: ["dogFood", "feed", "premium_feed", "treats"],
      cat: ["catFood", "feed", "premium_feed", "treats"],
      cow: ["livestockFeed", "feed", "premium_feed"],
      pig: ["livestockFeed", "feed", "premium_feed"],
      chicken: ["livestockFeed", "feed", "premium_feed"],
      horse: ["livestockFeed", "feed", "premium_feed"],
      sheep: ["livestockFeed", "feed", "premium_feed"],
    };

    const animalType = animal.type.toLowerCase();
    const foodType = foodItem.type;

    if (
      !validFoodMap[animalType] ||
      !validFoodMap[animalType].includes(foodType)
    ) {
      return res.status(400).json({
        success: false,
        error: `${animal.name || animal.type} cannot eat ${foodItem.name}`,
      });
    }

    // Calculate health boost based on food type
    let healthBoost = 0;
    if (foodType === "premium_feed") {
      healthBoost = 15;
    } else if (foodType === "treats") {
      healthBoost = 5;
    } else {
      healthBoost = 10; // Regular food
    }

    // Update animal
    animal.lastFed = new Date();
    animal.health = Math.min(100, animal.health + healthBoost);
    animal.lastCaredAt = new Date();
    await animal.save();

    // Consume food from inventory
    foodItem.quantity -= 1;

    // If quantity is 0, remove the item
    if (foodItem.quantity <= 0) {
      await Inventory.deleteOne({ _id: foodItem._id });
    } else {
      await foodItem.save();
    }

    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: "use",
      itemType: "inventory",
      itemId: foodItem._id,
      itemName: foodItem.name,
      amount: 0, // No currency change
      quantity: 1,
      description: `Fed ${foodItem.name} to ${animal.name || animal.type}`,
    });

    // Calculate additional fields for the UI
    const animalData = animal.toObject ? animal.toObject() : animal;
    animalData.currentHealth = animal.calculateCurrentHealth();
    animalData.marketValue = animal.marketValue;
    animalData.ageInDays = animal.ageInDays;

    res.status(200).json({
      success: true,
      data: {
        animal: animalData,
        inventory: foodItem.quantity > 0 ? foodItem : null,
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
    const { waterId } = req.body;

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

    // Find water in inventory - either by ID if provided, or by type
    const waterQuery = waterId
      ? { _id: waterId, userId: req.user.id, quantity: { $gt: 0 } }
      : { userId: req.user.id, type: "water", quantity: { $gt: 0 } };

    const waterItem = await Inventory.findOne(waterQuery);

    if (!waterItem) {
      return res.status(400).json({
        success: false,
        error: "You don't have any water. Purchase some from the market.",
      });
    }

    // Update animal
    animal.lastWatered = new Date();
    animal.health = Math.min(100, animal.health + 5);
    animal.lastCaredAt = new Date();
    await animal.save();

    // Consume water from inventory
    waterItem.quantity -= 1;

    // If quantity is 0, remove the item
    if (waterItem.quantity <= 0) {
      await Inventory.deleteOne({ _id: waterItem._id });
    } else {
      await waterItem.save();
    }

    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: "use",
      itemType: "inventory",
      itemId: waterItem._id,
      itemName: waterItem.name,
      amount: 0, // No currency change
      quantity: 1,
      description: `Gave water to ${animal.name || animal.type}`,
    });

    // Calculate additional fields for the UI
    const animalData = animal.toObject ? animal.toObject() : animal;
    animalData.currentHealth = animal.calculateCurrentHealth();
    animalData.marketValue = animal.marketValue;
    animalData.ageInDays = animal.ageInDays;

    res.status(200).json({
      success: true,
      data: {
        animal: animalData,
        inventory: waterItem.quantity > 0 ? waterItem : null,
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

    // Find the user to check and update currency
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

    // Calculate additional fields for the UI
    const animalData = animal.toObject ? animal.toObject() : animal;
    animalData.currentHealth = animal.calculateCurrentHealth();
    animalData.marketValue = animal.marketValue;
    animalData.ageInDays = animal.ageInDays;

    console.log("Sending animal data after vet visit:", {
      currentHealth: animalData.currentHealth,
      marketValue: animalData.marketValue,
      ageInDays: animalData.ageInDays,
    });

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
        animal: animalData,
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
    console.log(`Selling animal ${req.params.id}...`);

    const animal = await Animal.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!animal) {
      console.log(`Animal ${req.params.id} not found`);
      return res.status(404).json({
        success: false,
        error: "Animal not found",
      });
    }

    // Calculate the sale value
    const saleValue = animal.marketValue;
    console.log(`Animal ${req.params.id} market value: $${saleValue}`);

    // Update user's currency BEFORE deleting the animal
    const user = await User.findById(req.user.id);
    const oldCurrency = user.currency;
    user.currency += saleValue;
    await user.save();
    console.log(
      `Updated user currency from $${oldCurrency} to $${user.currency}`
    );

    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: "sell",
      itemType: "animal",
      itemId: animal._id,
      itemName: animal.name || animal.type,
      amount: saleValue,
      quantity: 1,
      description: `Sold ${animal.name || animal.type}`,
    });
    console.log(
      `Created transaction record for selling ${animal.name || animal.type}`
    );

    // Delete the animal AFTER updating currency and creating transaction
    await Animal.deleteOne({ _id: animal._id });
    console.log(`Deleted animal ${req.params.id}`);

    console.log(
      `Sending success response with amount: $${saleValue}, newCurrency: $${user.currency}`
    );
    res.status(200).json({
      success: true,
      amount: saleValue,
      newCurrency: user.currency,
    });
  } catch (error) {
    console.error("Error selling animal:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

// Give medicine to an animal
exports.giveMedicine = async (req, res) => {
  try {
    const { medicineId } = req.body;

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

    // Find the medicine in inventory
    const medicineItem = await Inventory.findOne({
      _id: medicineId,
      userId: req.user.id,
      quantity: { $gt: 0 },
    });

    if (!medicineItem) {
      return res.status(400).json({
        success: false,
        error: "Medicine not found in your inventory",
      });
    }

    // Apply medicine effects based on type
    let healthBoost = 0;
    switch (medicineItem.type) {
      case "basic_medicine":
        healthBoost = 20;
        break;
      case "medicine": // General Medicine
        healthBoost = 30;
        break;
      case "advanced_medicine":
        healthBoost = 40;
        break;
      default:
        healthBoost = 15;
    }

    // Update animal
    animal.health = Math.min(100, animal.health + healthBoost);
    animal.isSick = false; // Cure any sickness
    animal.lastCaredAt = new Date();
    await animal.save();

    // Consume medicine from inventory
    medicineItem.quantity -= 1;

    // If quantity is 0, remove the item
    if (medicineItem.quantity <= 0) {
      await Inventory.deleteOne({ _id: medicineItem._id });
    } else {
      await medicineItem.save();
    }

    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: "use",
      itemType: "inventory",
      itemId: medicineItem._id,
      itemName: medicineItem.name,
      amount: 0, // No currency change
      quantity: 1,
      description: `Used ${medicineItem.name} on ${animal.name || animal.type}`,
    });

    // Calculate additional fields for the UI
    const animalData = animal.toObject ? animal.toObject() : animal;
    animalData.currentHealth = animal.calculateCurrentHealth();
    animalData.marketValue = animal.marketValue;
    animalData.ageInDays = animal.ageInDays;

    res.status(200).json({
      success: true,
      data: {
        animal: animalData,
        inventory: medicineItem.quantity > 0 ? medicineItem : null,
      },
    });
  } catch (error) {
    console.error("Error giving medicine to animal:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

// Give treats to an animal
exports.giveTreats = async (req, res) => {
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

    // Find treats in inventory
    const treatsItem = await Inventory.findOne({
      userId: req.user.id,
      type: "treats",
      quantity: { $gt: 0 },
    });

    if (!treatsItem) {
      return res.status(400).json({
        success: false,
        error: "You don't have any treats. Purchase some from the market.",
      });
    }

    // Update animal
    animal.happiness = Math.min(100, animal.happiness + 15);
    animal.health = Math.min(100, animal.health + 2); // Small health boost
    animal.lastCaredAt = new Date();
    await animal.save();

    // Consume treats from inventory
    treatsItem.quantity -= 1;

    // If quantity is 0, remove the item
    if (treatsItem.quantity <= 0) {
      await Inventory.deleteOne({ _id: treatsItem._id });
    } else {
      await treatsItem.save();
    }

    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: "use",
      itemType: "inventory",
      itemId: treatsItem._id,
      itemName: treatsItem.name,
      amount: 0, // No currency change
      quantity: 1,
      description: `Gave treats to ${animal.name || animal.type}`,
    });

    // Calculate additional fields for the UI
    const animalData = animal.toObject ? animal.toObject() : animal;
    animalData.currentHealth = animal.calculateCurrentHealth();
    animalData.marketValue = animal.marketValue;
    animalData.ageInDays = animal.ageInDays;

    res.status(200).json({
      success: true,
      data: {
        animal: animalData,
        inventory: treatsItem.quantity > 0 ? treatsItem : null,
      },
    });
  } catch (error) {
    console.error("Error giving treats to animal:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

// Give vitamins to an animal
exports.giveVitamins = async (req, res) => {
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

    // Find vitamins in inventory
    const vitaminsItem = await Inventory.findOne({
      userId: req.user.id,
      type: "vitamins",
      quantity: { $gt: 0 },
    });

    if (!vitaminsItem) {
      return res.status(400).json({
        success: false,
        error: "You don't have any vitamins. Purchase some from the market.",
      });
    }

    // Update animal
    animal.health = Math.min(100, animal.health + 10);
    animal.lastCaredAt = new Date();
    await animal.save();

    // Consume vitamins from inventory
    vitaminsItem.quantity -= 1;

    // If quantity is 0, remove the item
    if (vitaminsItem.quantity <= 0) {
      await Inventory.deleteOne({ _id: vitaminsItem._id });
    } else {
      await vitaminsItem.save();
    }

    // Create transaction record
    await Transaction.create({
      userId: req.user.id,
      type: "use",
      itemType: "inventory",
      itemId: vitaminsItem._id,
      itemName: vitaminsItem.name,
      amount: 0, // No currency change
      quantity: 1,
      description: `Gave vitamins to ${animal.name || animal.type}`,
    });

    // Calculate additional fields for the UI
    const animalData = animal.toObject ? animal.toObject() : animal;
    animalData.currentHealth = animal.calculateCurrentHealth();
    animalData.marketValue = animal.marketValue;
    animalData.ageInDays = animal.ageInDays;

    res.status(200).json({
      success: true,
      data: {
        animal: animalData,
        inventory: vitaminsItem.quantity > 0 ? vitaminsItem : null,
      },
    });
  } catch (error) {
    console.error("Error giving vitamins to animal:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

console.log("Animal controller initialized");
