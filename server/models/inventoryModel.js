const mongoose = require("mongoose");

console.log("Initializing inventory model...");

const inventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "dogFood",
        "catFood",
        "livestockFeed",
        "water",
        "medicine",
        "treats",
      ],
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["lbs", "gallons", "units"],
      default: "units",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      // Default prices based on item type
      default: function () {
        const defaultPrices = {
          dogFood: 20,
          catFood: 15,
          livestockFeed: 10,
          water: 5,
          medicine: 50,
          treats: 10,
        };
        return defaultPrices[this.type] || 10;
      },
    },
    imageUrl: {
      type: String,
      // Default image URLs based on item type
      default: function () {
        const defaultImages = {
          dogFood: "/images/inventory/dog-food.png",
          catFood: "/images/inventory/cat-food.png",
          livestockFeed: "/images/inventory/livestock-feed.png",
          water: "/images/inventory/water.png",
          medicine: "/images/inventory/medicine.png",
          treats: "/images/inventory/treats.png",
        };
        return defaultImages[this.type] || "/images/inventory/default.png";
      },
    },
    affectsAnimalTypes: {
      type: [String],
      // Which animal types this inventory item can be used for
      default: function () {
        const animalTypes = {
          dogFood: ["dog"],
          catFood: ["cat"],
          livestockFeed: ["cow", "pig", "chicken", "horse", "sheep", "goat"],
          water: [
            "dog",
            "cat",
            "cow",
            "pig",
            "chicken",
            "horse",
            "sheep",
            "goat",
          ],
          medicine: [
            "dog",
            "cat",
            "cow",
            "pig",
            "chicken",
            "horse",
            "sheep",
            "goat",
          ],
          treats: ["dog", "cat"],
        };
        return animalTypes[this.type] || [];
      },
    },
    healthEffect: {
      type: Number,
      // How much this item affects animal health when used
      default: function () {
        const effects = {
          dogFood: 20,
          catFood: 20,
          livestockFeed: 15,
          water: 25,
          medicine: 50,
          treats: 5,
        };
        return effects[this.type] || 0;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Method to use inventory item on an animal
inventorySchema.methods.useOn = async function (animal, amount = 1) {
  // Check if we have enough quantity
  if (this.quantity < amount) {
    throw new Error("Not enough inventory");
  }

  // Check if this item can be used on this animal type
  if (!this.affectsAnimalTypes.includes(animal.type)) {
    throw new Error(`${this.name} cannot be used on ${animal.type}`);
  }

  // Reduce inventory quantity
  this.quantity -= amount;

  // Apply health effect to animal
  if (
    this.type === "dogFood" ||
    this.type === "catFood" ||
    this.type === "livestockFeed"
  ) {
    animal.lastFed = new Date();
  }

  if (this.type === "water") {
    animal.lastWatered = new Date();
  }

  // Update animal health
  animal.health = Math.min(100, animal.health + this.healthEffect);
  animal.lastCaredAt = new Date();

  // Save both documents
  await Promise.all([this.save(), animal.save()]);

  return { animal, inventory: this };
};

console.log("Inventory model initialized");

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
