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
        "feed",
        "premium_feed",
        "vitamins",
        "basic_medicine",
        "advanced_medicine",
      ],
      set: function (value) {
        // Ensure the type matches one of the enum values exactly
        const validTypes = [
          "dogFood",
          "catFood",
          "livestockFeed",
          "water",
          "medicine",
          "treats",
          "feed",
          "premium_feed",
          "vitamins",
          "basic_medicine",
          "advanced_medicine",
        ];

        // Try to find a case-insensitive match
        const match = validTypes.find(
          (type) => type.toLowerCase() === value.toLowerCase()
        );

        return match || value;
      },
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
          feed: 20,
          premium_feed: 50,
          vitamins: 40,
          basic_medicine: 30,
          advanced_medicine: 80,
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
          medicine: "/images/inventory/general-medicine.png",
          treats: "/images/inventory/treats.png",
          feed: "/images/inventory/livestock-feed.png",
          premium_feed: "/images/inventory/premium-feed.png",
          vitamins: "/images/inventory/vitamins.png",
          basic_medicine: "/images/inventory/basic-medicine.png",
          advanced_medicine: "/images/inventory/advanced-medicine.png",
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
          feed: ["cow", "pig", "chicken", "horse", "sheep", "goat"],
          premium_feed: [
            "dog",
            "cat",
            "cow",
            "pig",
            "chicken",
            "horse",
            "sheep",
            "goat",
          ],
          vitamins: [
            "dog",
            "cat",
            "cow",
            "pig",
            "chicken",
            "horse",
            "sheep",
            "goat",
          ],
          basic_medicine: [
            "dog",
            "cat",
            "cow",
            "pig",
            "chicken",
            "horse",
            "sheep",
            "goat",
          ],
          advanced_medicine: [
            "dog",
            "cat",
            "cow",
            "pig",
            "chicken",
            "horse",
            "sheep",
            "goat",
          ],
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
          feed: 15,
          premium_feed: 30,
          vitamins: 20,
          basic_medicine: 40,
          advanced_medicine: 70,
        };
        return effects[this.type] || 0;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Use inventory item on an animal
inventorySchema.methods.useOn = async function (animal) {
  // Decrement quantity
  this.quantity -= 1;

  // Apply effects based on inventory type
  switch (this.type) {
    case "dogFood":
    case "catFood":
    case "livestockFeed":
    case "feed":
    case "premium_feed":
      animal.lastFed = new Date();
      animal.health = Math.min(
        100,
        animal.health + (this.type === "premium_feed" ? 25 : 15)
      );
      animal.lastCaredAt = new Date();
      break;
    case "water":
      animal.lastWatered = new Date();
      animal.health = Math.min(100, animal.health + 10);
      animal.lastCaredAt = new Date();
      break;
    case "medicine":
    case "basic_medicine":
    case "advanced_medicine":
      animal.health = Math.min(
        100,
        animal.health +
          (this.type === "advanced_medicine"
            ? 40
            : this.type === "medicine"
            ? 30
            : 20)
      );
      animal.isSick = false;
      animal.lastCaredAt = new Date();
      break;
    case "treats":
      animal.happiness = Math.min(100, animal.happiness + 20);
      animal.lastCaredAt = new Date();
      break;
    case "vitamins":
      animal.health = Math.min(100, animal.health + 15);
      animal.happiness = Math.min(100, animal.happiness + 10);
      animal.lastCaredAt = new Date();
      break;
    default:
      // Generic effect for unknown types
      animal.health = Math.min(100, animal.health + 10);
      animal.lastCaredAt = new Date();
  }

  // Save the animal
  await animal.save();

  // If quantity is 0, delete the inventory item
  if (this.quantity <= 0) {
    await this.model("Inventory").deleteOne({ _id: this._id });
    return { animal, inventory: null };
  } else {
    // Save the inventory
    await this.save();
    return { animal, inventory: this };
  }
};

console.log("Inventory model initialized");

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
