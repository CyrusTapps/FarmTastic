const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAnimals,
  getAnimal,
  createAnimal,
  feedAnimal,
  waterAnimal,
  callVet,
  sellAnimal,
} = require("../controllers/animalController");

console.log("Initializing animal routes...");

// All routes are protected
router.use(protect);

// Get all animals and create a new animal
router.route("/").get(getAnimals).post(createAnimal);

// Get, feed, water, call vet for, and sell a specific animal
router.route("/:id").get(getAnimal);

router.route("/:id/feed").post(feedAnimal);

router.route("/:id/water").post(waterAnimal);

router.route("/:id/vet").post(callVet);

router.route("/:id/sell").post(sellAnimal);

console.log("Animal routes initialized");

module.exports = router;
