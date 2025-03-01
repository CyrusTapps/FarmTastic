import api from "./api";

// Get transactions with optional limit and filter
export const getTransactions = async (limit = null, filter = null) => {
  try {
    let params = {};

    if (limit) {
      params.limit = limit;
    }

    // Handle different filter types more explicitly
    if (filter && filter !== "all") {
      // Check if it's a transaction type filter (buy/sell)
      if (
        filter === "buy" ||
        filter === "sell" ||
        filter === "vet" ||
        filter === "use"
      ) {
        params.type = filter;
      }
      // Check if it's an item type filter (animal/inventory)
      else if (filter === "animal" || filter === "inventory") {
        params.itemType = filter;
      }
    }

    console.log("Fetching transactions with params:", params);
    const response = await api.get("/transactions", { params });
    console.log("Transaction response:", response);
    return response.data; // Return response.data instead of the whole response
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
