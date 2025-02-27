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

// Buy inventory
export const buyInventory = async (inventoryData) => {
  try {
    // Ensure the type is in the correct case
    const typeMapping = {
      dogfood: "dogFood",
      catfood: "catFood",
      livestockfeed: "livestockFeed",
      water: "water",
      medicine: "medicine",
      generalmedicine: "medicine",
      treats: "treats",
      feed: "feed",
      premium_feed: "premium_feed",
      premiumfeed: "premium_feed",
      vitamins: "vitamins",
      basic_medicine: "basic_medicine",
      basicmedicine: "basic_medicine",
      advanced_medicine: "advanced_medicine",
      advancedmedicine: "advanced_medicine",
    };

    // If the lowercase version exists in our mapping, use the correct case
    if (inventoryData.type && typeMapping[inventoryData.type.toLowerCase()]) {
      inventoryData.type = typeMapping[inventoryData.type.toLowerCase()];
    }

    const response = await api.post("/inventory", inventoryData);
    return response.data;
  } catch (error) {
    console.error(`Error buying ${inventoryData.type}:`, error);
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
