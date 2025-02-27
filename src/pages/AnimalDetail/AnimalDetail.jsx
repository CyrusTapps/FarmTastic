import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getAnimal,
  feedAnimal,
  waterAnimal,
  callVet,
  sellAnimal,
  giveMedicine,
  giveTreats,
  giveVitamins,
} from "../../services/animalService";
import { getInventory } from "../../services/inventoryService";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useRefresh } from "../../context/RefreshContext";
// Import the images directly
import dogImg from "../../assets/images/animals/dog.jpg";
import catImg from "../../assets/images/animals/cat.jpg";
import cowImg from "../../assets/images/animals/cow.jpg";
import pigImg from "../../assets/images/animals/pig.jpg";
import chickenImg from "../../assets/images/animals/chicken.jpg";
import horseImg from "../../assets/images/animals/horse.jpg";
import sheepImg from "../../assets/images/animals/sheep.jpg";
import "./AnimalDetail.css";
import DebugMonitor from "../../components/DebugMonitor";

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const [animal, setAnimal] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const { triggerRefresh } = useRefresh();

  // Map of animal types to their image assets
  const animalImages = {
    dog: dogImg,
    cat: catImg,
    cow: cowImg,
    pig: pigImg,
    chicken: chickenImg,
    horse: horseImg,
    sheep: sheepImg,
  };

  // Fetch animal data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch animal data
        const response = await getAnimal(id);
        setAnimal(response.data);

        // Fetch inventory data
        const inventoryResponse = await getInventory();
        setInventory(inventoryResponse.data);

        setLoading(false);
      } catch (error) {
        console.error(`Error fetching animal:`, error);
        setError("Failed to load animal. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Get available food items for this animal
  const getAvailableFoodItems = () => {
    if (!animal) return [];

    const validFoodMap = {
      dog: ["dogFood", "feed", "premium_feed", "treats"],
      cat: ["catFood", "feed", "premium_feed", "treats"],
      cow: ["livestockFeed", "feed", "premium_feed"],
      pig: ["livestockFeed", "feed", "premium_feed"],
      chicken: ["livestockFeed", "feed", "premium_feed"],
      horse: ["livestockFeed", "feed", "premium_feed"],
      sheep: ["livestockFeed", "feed", "premium_feed"],
    };

    const animalType = animal.type.toLowerCase();
    const validFoodTypes = validFoodMap[animalType] || [];

    return inventory.filter(
      (item) => validFoodTypes.includes(item.type) && item.quantity > 0
    );
  };

  // Get available medicine items
  const getAvailableMedicineItems = () => {
    if (!inventory) return [];

    return inventory.filter(
      (item) =>
        ["medicine", "basic_medicine", "advanced_medicine"].includes(
          item.type
        ) && item.quantity > 0
    );
  };

  // Handle feed action
  const handleFeed = async () => {
    const availableFood = getAvailableFoodItems();

    if (availableFood.length === 0) {
      setActionMessage("No appropriate food in inventory!");
      setTimeout(() => setActionMessage(null), 2000);
      return;
    }

    // If only one food item is available, use it directly
    if (availableFood.length === 1) {
      feedWithItem(availableFood[0]._id);
    } else {
      // Otherwise show the food selection modal
      setShowFoodModal(true);
    }
  };

  // Feed with selected inventory item
  const feedWithItem = async (foodId) => {
    try {
      setActionInProgress(true);
      setActionMessage("Feeding...");
      setShowFoodModal(false);

      const response = await feedAnimal(id, { foodId });

      // Update animal data
      setAnimal(response.data.animal);

      // Update inventory to reflect used food
      const updatedInventory = inventory
        .map((item) => {
          if (item._id === foodId) {
            // If the item was completely used up, remove it
            if (!response.data.inventory) {
              return null;
            }
            // Otherwise update its quantity
            return response.data.inventory;
          }
          return item;
        })
        .filter(Boolean); // Remove null items

      setInventory(updatedInventory);

      setActionMessage(`${animal.name || animal.type} enjoyed the food!`);
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
      triggerRefresh(); // Refresh dashboard data
    } catch (error) {
      console.error(`Error feeding animal:`, error);
      setActionMessage(error.response?.data?.error || "Failed to feed animal.");
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    }
  };

  // Handle water action
  const handleWater = async () => {
    // Check if we have water in inventory
    const waterItem = inventory.find((item) => item.type === "water");

    if (!waterItem || waterItem.quantity <= 0) {
      setActionMessage(
        "You don't have any water. Purchase some from the market."
      );
      setTimeout(() => setActionMessage(null), 3000);
      return;
    }

    try {
      setActionInProgress(true);
      setActionMessage("Giving water...");

      // Pass the water item ID to the server
      const response = await waterAnimal(id, { waterId: waterItem._id });

      // Update animal data
      setAnimal(response.data.animal);

      // Update inventory to reflect used water
      const updatedInventory = inventory
        .map((item) => {
          if (item._id === waterItem._id) {
            // If the water was completely used up, remove it
            if (!response.data.inventory) {
              return null;
            }
            // Otherwise update its quantity
            return response.data.inventory;
          }
          return item;
        })
        .filter(Boolean); // Remove null items

      setInventory(updatedInventory);

      setActionMessage(`${animal.name || animal.type} enjoyed the water!`);
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
      triggerRefresh(); // Refresh dashboard data
    } catch (error) {
      console.error(`Error watering animal:`, error);
      setActionMessage(error.response?.data?.error || "Failed to give water.");
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    }
  };

  // Handle medicine action
  const handleMedicine = async () => {
    const availableMedicine = getAvailableMedicineItems();

    if (availableMedicine.length === 0) {
      setActionMessage(
        "No medicine in inventory! Visit the market to purchase some."
      );
      setTimeout(() => setActionMessage(null), 2000);
      return;
    }

    // If only one medicine item is available, use it directly
    if (availableMedicine.length === 1) {
      giveMedicineToAnimal(availableMedicine[0]._id);
    } else {
      // Otherwise show the medicine selection modal
      setShowMedicineModal(true);
    }
  };

  // Give medicine to animal
  const giveMedicineToAnimal = async (medicineId) => {
    try {
      setActionInProgress(true);
      setActionMessage("Administering medicine...");
      setShowMedicineModal(false);

      const response = await giveMedicine(id, medicineId);

      // Update animal data
      setAnimal(response.data.animal);

      // Update inventory to reflect used medicine
      const updatedInventory = inventory
        .map((item) => {
          if (item._id === medicineId) {
            // If the item was completely used up, remove it
            if (!response.data.inventory) {
              return null;
            }
            // Otherwise update its quantity
            return response.data.inventory;
          }
          return item;
        })
        .filter(Boolean); // Remove null items

      setInventory(updatedInventory);

      setActionMessage(`${animal.name || animal.type} is feeling better!`);
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
      triggerRefresh(); // Refresh dashboard data
    } catch (error) {
      console.error(`Error giving medicine to animal:`, error);
      setActionMessage(
        error.response?.data?.error || "Failed to administer medicine."
      );
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    }
  };

  // Handle treats action
  const handleTreats = async () => {
    // Check if we have treats in inventory
    const treatsItem = inventory.find((item) => item.type === "treats");

    if (!treatsItem || treatsItem.quantity <= 0) {
      setActionMessage(
        "You don't have any treats. Purchase some from the market."
      );
      setTimeout(() => setActionMessage(null), 3000);
      return;
    }

    try {
      setActionInProgress(true);
      setActionMessage("Giving treats...");

      const response = await giveTreats(id);

      // Update animal data
      setAnimal(response.data.animal);

      // Update inventory to reflect used treats
      const updatedInventory = inventory
        .map((item) => {
          if (item.type === "treats") {
            // If the treats were completely used up, remove them
            if (!response.data.inventory) {
              return null;
            }
            // Otherwise update its quantity
            return response.data.inventory;
          }
          return item;
        })
        .filter(Boolean); // Remove null items

      setInventory(updatedInventory);

      setActionMessage(`${animal.name || animal.type} loved the treats!`);
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
      triggerRefresh(); // Refresh dashboard data
    } catch (error) {
      console.error(`Error giving treats to animal:`, error);
      setActionMessage(error.response?.data?.error || "Failed to give treats.");
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    }
  };

  // Handle vitamins action
  const handleVitamins = async () => {
    // Check if we have vitamins in inventory
    const vitaminsItem = inventory.find((item) => item.type === "vitamins");

    if (!vitaminsItem || vitaminsItem.quantity <= 0) {
      setActionMessage(
        "You don't have any vitamins. Purchase some from the market."
      );
      setTimeout(() => setActionMessage(null), 3000);
      return;
    }

    try {
      setActionInProgress(true);
      setActionMessage("Giving vitamins...");

      const response = await giveVitamins(id);

      // Update animal data
      setAnimal(response.data.animal);

      // Update inventory to reflect used vitamins
      const updatedInventory = inventory
        .map((item) => {
          if (item.type === "vitamins") {
            // If the vitamins were completely used up, remove them
            if (!response.data.inventory) {
              return null;
            }
            // Otherwise update its quantity
            return response.data.inventory;
          }
          return item;
        })
        .filter(Boolean); // Remove null items

      setInventory(updatedInventory);

      setActionMessage(
        `${animal.name || animal.type} is healthier with vitamins!`
      );
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
      triggerRefresh(); // Refresh dashboard data
    } catch (error) {
      console.error(`Error giving vitamins to animal:`, error);
      setActionMessage(
        error.response?.data?.error || "Failed to give vitamins."
      );
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    }
  };

  // Handle call vet action
  const handleCallVet = async () => {
    try {
      setActionInProgress(true);
      setActionMessage("Calling vet...");

      const response = await callVet(id);
      setAnimal(response.data.animal);

      // Update user currency
      if (response.data.user && response.data.user.currency !== undefined) {
        updateUser({ ...currentUser, currency: response.data.user.currency });
      }

      setActionMessage("Vet visit successful!");
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
      triggerRefresh();
    } catch (error) {
      console.error(`Error calling vet for animal ${id}:`, error);
      setActionMessage(error.response?.data?.error || "Failed to call vet.");
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    }
  };

  // Handle sell action
  const handleSell = () => {
    // Get the current market value
    const saleValue = animal.marketValue;

    // Ask for confirmation with the sale value included
    if (
      window.confirm(
        `Are you sure you want to sell ${
          animal.name || animal.type
        } for $${saleValue}?`
      )
    ) {
      setActionInProgress(true);
      setActionMessage("Selling animal...");
      console.log(
        `Attempting to sell animal ${animal._id} for $${saleValue}...`
      );

      sellAnimal(animal._id)
        .then((response) => {
          console.log("Sell response:", response);
          // Use the saleValue if response.amount is undefined
          const soldAmount = response.amount || saleValue;
          const newCurrency =
            response.newCurrency || currentUser.currency + soldAmount;

          console.log(
            `Sale successful. Amount: $${soldAmount}, New currency: $${newCurrency}`
          );

          setActionMessage(
            `Successfully sold ${
              animal.name || animal.type
            } for $${soldAmount}!`
          );

          // Update user currency
          updateUser({ ...currentUser, currency: newCurrency });
          triggerRefresh();

          // Navigate back to dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        })
        .catch((error) => {
          console.error("Error selling animal:", error);
          let errorMessage = "Failed to sell animal";

          if (error.response && error.response.data) {
            errorMessage = error.response.data.error || errorMessage;
            console.error("Server error response:", error.response.data);
          }

          setActionMessage(`Error: ${errorMessage}`);

          // Even if there was an error in the response handling,
          // we should still navigate back if the animal was actually deleted
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        })
        .finally(() => {
          setActionInProgress(false);
        });
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate("/dashboard");
  };

  // Get color based on health percentage
  const getHealthColor = (health) => {
    if (health >= 70) return "var(--color-green)";
    if (health >= 40) return "var(--color-yellow)";
    return "var(--color-red)";
  };

  // Format time since last care
  const getTimeSinceLastCare = (timestamp) => {
    if (!timestamp) return "Never";

    const lastCare = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - lastCare) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - lastCare) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="animal-detail-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="animal-detail-container">
        <div className="error-message">Animal not found.</div>
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="animal-detail-container">
      <DebugMonitor componentName="AnimalDetail" />
      <button className="back-button" onClick={handleBack}>
        &larr; Back to Dashboard
      </button>

      <div className="animal-detail-card">
        <div className="animal-header">
          <h1>{animal.name || animal.type}</h1>
          <div
            className="animal-health"
            style={{
              color: getHealthColor(animal.currentHealth || animal.health),
            }}
          >
            Health: {animal.currentHealth || animal.health}%
          </div>
        </div>

        <div className="animal-image-container">
          <div className="animal-image">
            {animal.type && animalImages[animal.type] ? (
              <img
                src={animalImages[animal.type]}
                alt={animal.name || animal.type}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  backgroundColor: "var(--color-light-green)",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-dark-gray)",
                  fontWeight: "bold",
                }}
              >
                No image available for {animal.type}
              </div>
            )}
          </div>
        </div>

        <div className="animal-info">
          <div className="info-row">
            <span className="info-label">Type:</span>
            <span className="info-value">{animal.type}</span>
          </div>

          {animal.quantity > 1 && (
            <div className="info-row">
              <span className="info-label">Quantity:</span>
              <span className="info-value">{animal.quantity}</span>
            </div>
          )}

          <div className="info-row">
            <span className="info-label">Last Visited:</span>
            <span className="info-value">
              {getTimeSinceLastCare(animal.lastCaredAt)}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Age:</span>
            <span className="info-value">{animal.ageInDays} days</span>
          </div>

          <div className="info-row">
            <span className="info-label">Value:</span>
            <span className="info-value">${animal.marketValue}</span>
          </div>
        </div>

        <div className="action-message-container">
          {actionMessage && (
            <div className="action-message">{actionMessage}</div>
          )}
        </div>

        <div className="animal-actions">
          <button
            className="action-button feed-button"
            onClick={handleFeed}
            disabled={actionInProgress}
          >
            Feed {animal.name || animal.type}
          </button>

          <button
            className="action-button water-button"
            onClick={handleWater}
            disabled={actionInProgress}
          >
            Give Water
          </button>

          <button
            className="action-button medicine-button"
            onClick={handleMedicine}
            disabled={actionInProgress}
          >
            Give Medicine
          </button>

          <button
            className="action-button treats-button"
            onClick={handleTreats}
            disabled={actionInProgress}
          >
            Give Treats
          </button>

          <button
            className="action-button vitamins-button"
            onClick={handleVitamins}
            disabled={actionInProgress}
          >
            Give Vitamins
          </button>

          <button
            className="action-button vet-button"
            onClick={handleCallVet}
            disabled={actionInProgress}
          >
            Call Vet
          </button>

          <button
            className="action-button sell-button"
            onClick={handleSell}
            disabled={actionInProgress}
          >
            Sell {animal.name || animal.type}
          </button>
        </div>
      </div>

      {/* Food Selection Modal */}
      {showFoodModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Select Food</h2>
            <div className="food-items-list">
              {getAvailableFoodItems().map((item) => (
                <div
                  key={item._id}
                  className="food-item"
                  onClick={() => feedWithItem(item._id)}
                >
                  <div className="food-item-name">{item.name}</div>
                  <div className="food-item-quantity">
                    Quantity: {item.quantity}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="modal-close-button"
              onClick={() => setShowFoodModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Medicine Selection Modal */}
      {showMedicineModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Select Medicine</h2>
            <div className="food-items-list">
              {getAvailableMedicineItems().map((item) => (
                <div
                  key={item._id}
                  className="food-item"
                  onClick={() => giveMedicineToAnimal(item._id)}
                >
                  <div className="food-item-name">{item.name}</div>
                  <div className="food-item-quantity">
                    Quantity: {item.quantity}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="modal-close-button"
              onClick={() => setShowMedicineModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalDetail;
