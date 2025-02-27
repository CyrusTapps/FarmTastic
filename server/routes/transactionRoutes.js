const express = require("express");
const { getTransactions } = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all routes
router.use(protect);

// Get transactions
router.get("/", getTransactions);

module.exports = router;
