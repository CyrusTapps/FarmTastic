import api from "./api";

console.log("Initializing animal service...");

// Get all animals
export const getAnimals = async () => {
  try {
    const response = await api.get("/animals");
    console.log("getAnimals response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching animals:", error);
    throw error;
  }
};

// Get a single animal
export const getAnimal = async (id) => {
  try {
    const response = await api.get(`/animals/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching animal ${id}:`, error);
    throw error;
  }
};

// Feed an animal
export const feedAnimal = async (id, data = {}) => {
  try {
    const response = await api.post(`/animals/${id}/feed`, data);
    return response.data;
  } catch (error) {
    console.error(`Error feeding animal ${id}:`, error);
    throw error;
  }
};

// Water an animal
export const waterAnimal = async (id, data = {}) => {
  try {
    const response = await api.post(`/animals/${id}/water`, data);
    return response.data;
  } catch (error) {
    console.error(`Error watering animal ${id}:`, error);
    throw error;
  }
};

// Call vet for an animal
export const callVet = async (id) => {
  try {
    const response = await api.post(`/animals/${id}/vet`);
    return response.data;
  } catch (error) {
    console.error(`Error calling vet for animal ${id}:`, error);
    throw error;
  }
};

// Sell an animal
export const sellAnimal = async (id) => {
  try {
    console.log(`Selling animal ${id}...`);
    const response = await api.post(`/animals/${id}/sell`);
    console.log(`Sell response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error selling animal ${id}:`, error);
    // Include more detailed error information
    if (error.response) {
      console.error(`Response status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
    throw error;
  }
};

// Create a new animal
export const createAnimal = async (animalData) => {
  try {
    const response = await api.post("/animals", animalData);
    return response.data;
  } catch (error) {
    console.error("Error creating animal:", error);
    throw error;
  }
};

// Give medicine to an animal
export const giveMedicine = async (id, medicineId) => {
  try {
    const response = await api.post(`/animals/${id}/medicine`, { medicineId });
    return response.data;
  } catch (error) {
    console.error(`Error giving medicine to animal ${id}:`, error);
    throw error;
  }
};

// Give treats to an animal
export const giveTreats = async (id) => {
  try {
    const response = await api.post(`/animals/${id}/treats`);
    return response.data;
  } catch (error) {
    console.error(`Error giving treats to animal ${id}:`, error);
    throw error;
  }
};

// Give vitamins to an animal
export const giveVitamins = async (id) => {
  try {
    const response = await api.post(`/animals/${id}/vitamins`);
    return response.data;
  } catch (error) {
    console.error(`Error giving vitamins to animal ${id}:`, error);
    throw error;
  }
};

console.log("Animal service initialized");
