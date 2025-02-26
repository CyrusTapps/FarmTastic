import api from "./api";

console.log("Initializing animal service...");

// Get all animals
export const getAnimals = async () => {
  try {
    const response = await api.get("/animals");
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
export const feedAnimal = async (id) => {
  try {
    const response = await api.post(`/animals/${id}/feed`);
    return response.data;
  } catch (error) {
    console.error(`Error feeding animal ${id}:`, error);
    throw error;
  }
};

// Water an animal
export const waterAnimal = async (id) => {
  try {
    const response = await api.post(`/animals/${id}/water`);
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
    const response = await api.post(`/animals/${id}/sell`);
    return response.data;
  } catch (error) {
    console.error(`Error selling animal ${id}:`, error);
    throw error;
  }
};

console.log("Animal service initialized");
