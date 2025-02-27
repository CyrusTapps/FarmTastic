const mongoose = require("mongoose");

console.log("Initializing animal model...");

const animalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      // Name is optional for livestock (like cows, pigs)
      // but required for pets (like dogs, cats)
    },
    type: {
      type: String,
      required: true,
      enum: ["dog", "cat", "cow", "pig", "chicken", "horse", "sheep", "goat"],
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["pet", "livestock"],
      lowercase: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
      // For livestock, this can be > 1
      // For pets, this should always be 1
    },
    health: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 100,
    },
    lastFed: {
      type: Date,
      default: Date.now,
    },
    lastWatered: {
      type: Date,
      default: Date.now,
    },
    lastCaredAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      // Default image URLs based on animal type
      default: function () {
        const defaultImages = {
          dog: "/images/animals/dog.png",
          cat: "/images/animals/cat.png",
          cow: "/images/animals/cow.png",
          pig: "/images/animals/pig.png",
          chicken: "/images/animals/chicken.png",
          horse: "/images/animals/horse.png",
          sheep: "/images/animals/sheep.png",
          goat: "/images/animals/goat.png",
        };
        return defaultImages[this.type] || "/images/animals/default.png";
      },
    },
    value: {
      type: Number,
      required: true,
      min: 0,
      // Default values based on animal type
      default: function () {
        const defaultValues = {
          dog: 500,
          cat: 400,
          cow: 1000,
          pig: 800,
          chicken: 200,
          horse: 2000,
          sheep: 600,
          goat: 500,
        };
        return defaultValues[this.type] || 300;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to enforce rules
animalSchema.pre("save", function (next) {
  // If it's a pet, quantity should always be 1
  if (this.category === "pet") {
    this.quantity = 1;
  }

  // If it's a pet, name is required
  if (this.category === "pet" && !this.name) {
    return next(new Error("Name is required for pets"));
  }

  next();
});

// Method to calculate current health based on time since last care
animalSchema.methods.calculateCurrentHealth = function () {
  const now = new Date();

  // Calculate hours since last fed
  const hoursSinceLastFed = (now - this.lastFed) / (1000 * 60 * 60);

  // Calculate hours since last watered
  const hoursSinceLastWatered = (now - this.lastWatered) / (1000 * 60 * 60);

  // Health decreases by 5 points for every 24 hours not fed
  const feedingHealthDecrease = Math.floor(hoursSinceLastFed / 24) * 5;

  // Health decreases by 10 points for every 24 hours not watered
  const wateringHealthDecrease = Math.floor(hoursSinceLastWatered / 24) * 10;

  // Calculate new health
  let newHealth = this.health - feedingHealthDecrease - wateringHealthDecrease;

  // Ensure health doesn't go below 0
  newHealth = Math.max(0, newHealth);

  return newHealth;
};

// Method to feed the animal
animalSchema.methods.feed = function () {
  this.lastFed = new Date();
  this.lastCaredAt = new Date();

  // Increase health by 10 points when fed, but not above 100
  this.health = Math.min(100, this.health + 10);

  return this.save();
};

// Method to water the animal
animalSchema.methods.water = function () {
  this.lastWatered = new Date();
  this.lastCaredAt = new Date();

  // Increase health by 15 points when watered, but not above 100
  this.health = Math.min(100, this.health + 15);

  return this.save();
};

// Method to call vet (restore health to 100%)
animalSchema.methods.callVet = function () {
  this.health = 100;
  this.lastCaredAt = new Date();

  return this.save();
};

// Virtual for age in days
animalSchema.virtual("ageInDays").get(function () {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for current market value based on health and age
animalSchema.virtual("marketValue").get(function () {
  // Get the base purchase price for this animal type
  const animalPrices = {
    cat: 100,
    dog: 150,
    chicken: 50,
    cow: 300,
    horse: 500,
    pig: 200,
    sheep: 250,
    goat: 200,
  };

  // Base value is the purchase price
  const baseValue = animalPrices[this.type] || 100;

  // Calculate age in days (ensure it's accurate)
  const ageInDays = Math.floor(
    (new Date() - this.createdAt) / (1000 * 60 * 60 * 24)
  );

  // Get current health (ensure it's accurate)
  const currentHealth = this.health; // Use stored health value directly

  // For brand new animals (less than 1 hour old), force value to be 66% of purchase
  if (new Date() - this.createdAt < 1000 * 60 * 60) {
    return Math.round(baseValue * 0.66);
  }

  // Initial value is 66% of purchase price
  let value = baseValue * 0.66;

  // Health factor (0.5 to 1.5)
  const healthFactor = 0.5 + (currentHealth / 100) * 1.0;

  // Age factor - value increases with time owned
  let ageFactor = 1.0;

  if (ageInDays < 7) {
    // First week
    ageFactor = 1.0 + (ageInDays / 7) * 0.35;
  } else if (ageInDays < 30) {
    // First month
    ageFactor = 1.35 + ((ageInDays - 7) / 23) * 0.45;
  } else if (ageInDays < 60) {
    // Second month
    ageFactor = 1.8 + ((ageInDays - 30) / 30) * 0.3;
  } else {
    // After 2 months
    ageFactor = 2.1;
  }

  // Calculate final value with all factors
  value = value * healthFactor * ageFactor;

  // Add a small random factor (±5%)
  const randomFactor = 0.95 + Math.random() * 0.1;
  value = value * randomFactor;

  // Round to nearest whole number
  return Math.round(value);
});

console.log("Animal model initialized");

const Animal = mongoose.model("Animal", animalSchema);

module.exports = Animal;
