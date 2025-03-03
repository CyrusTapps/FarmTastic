import api from "./api";

// Get transactions with optional limit and filter
export const getTransactions = async (limit = null, filter = null) => {
  try {
    let params = {};

    if (limit) {
      params.limit = limit;
    }

    // Pass the filter directly if it's not "all"
    if (filter && filter !== "all") {
      params.filter = filter;
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
