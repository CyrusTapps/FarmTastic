const mongoose = require("mongoose");
const Animal = require("../models/animalModel");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env.production"),
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function migrateAnimals() {
  try {
    console.log("Starting animal schema migration...");
    console.log(
      "Using MongoDB URI:",
      process.env.MONGO_URI.substring(0, 20) + "..."
    );

    // Get all animals
    const animals = await Animal.find({});
    console.log(`Found ${animals.length} animals to migrate`);

    // Update each animal
    for (const animal of animals) {
      // Initialize new fields if they don't exist
      if (!animal.lastHealthUpdate) {
        animal.lastHealthUpdate =
          animal.lastCaredAt || animal.updatedAt || animal.createdAt;
      }

      if (!animal.healthHistory || !Array.isArray(animal.healthHistory)) {
        animal.healthHistory = [];
      }

      // Save the updated animal
      await animal.save();
      console.log(`Migrated animal ${animal._id}`);
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    console.error("Error details:", error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    mongoose.disconnect();
  }
}

migrateAnimals();
