import api from "./api";

console.log("Initializing inventory service...");

// Get all inventory items
export const getInventory = async () => {
  try {
    const response = await api.get("/inventory");
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

// Get a single inventory item
export const getInventoryItem = async (id) => {
  try {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching inventory item ${id}:`, error);
    throw error;
  }
};

// Buy inventory items
export const buyInventory = async (type, quantity) => {
  try {
    const response = await api.post("/inventory", { type, quantity });
    return response.data;
  } catch (error) {
    console.error(`Error buying ${type}:`, error);
    throw error;
  }
};

// Sell inventory items
export const sellInventory = async (id, quantity) => {
  try {
    const response = await api.post(`/inventory/${id}/sell`, { quantity });
    return response.data;
  } catch (error) {
    console.error(`Error selling inventory item ${id}:`, error);
    throw error;
  }
};

console.log("Inventory service initialized");
