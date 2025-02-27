const Transaction = require("../models/transactionModel");

// Get transactions with optional filtering
exports.getTransactions = async (req, res) => {
  try {
    const { limit, filter } = req.query;

    // Build query
    const query = { userId: req.user.id };

    // Add filters if provided
    if (filter === "purchase" || filter === "sale") {
      query.type = filter;
    }

    if (filter === "animal" || filter === "inventory") {
      query.itemType = filter;
    }

    // Create the query
    let transactionsQuery = Transaction.find(query).sort({ createdAt: -1 }); // Most recent first

    // Apply limit if provided
    if (limit) {
      transactionsQuery = transactionsQuery.limit(parseInt(limit));
    }

    // Execute query
    const transactions = await transactionsQuery.exec();

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
