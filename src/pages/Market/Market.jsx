import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./Market.css";
import { buyInventory } from "../../services/inventoryService";
import { createAnimal } from "../../services/animalService";
import { useRefresh } from "../../context/RefreshContext";

// Import animal images
import catImg from "../../assets/images/animals/cat.jpg";
import chickenImg from "../../assets/images/animals/chicken.jpg";
import cowImg from "../../assets/images/animals/cow.jpg";
import dogImg from "../../assets/images/animals/dog.jpg";
import horseImg from "../../assets/images/animals/horse.jpg";
import pigImg from "../../assets/images/animals/pig.jpg";
import sheepImg from "../../assets/images/animals/sheep.jpg";

// Import inventory images
import dogFoodImg from "../../assets/images/inventory/dog-food.png";
import catFoodImg from "../../assets/images/inventory/cat-food.png";
import feedImg from "../../assets/images/inventory/livestock-feed.png";
import genMedImg from "../../assets/images/inventory/general-medicine.png";
import vitaminsImg from "../../assets/images/inventory/vitamins.png";
import waterImg from "../../assets/images/inventory/water.png";
import treatsImg from "../../assets/images/inventory/treats.png";
import premFeedImg from "../../assets/images/inventory/premium-feed.png";
import basicMedImg from "../../assets/images/inventory/basic-medicine.png";
import advMedImg from "../../assets/images/inventory/advanced-medicine.png";

// Map of animal types to their images
const animalImages = {
  cat: catImg,
  chicken: chickenImg,
  cow: cowImg,
  dog: dogImg,
  horse: horseImg,
  pig: pigImg,
  sheep: sheepImg,
};

// Map of inventory types to their images
const inventoryImages = {
  dogFood: dogFoodImg,
  catFood: catFoodImg,
  livestockFeed: feedImg,
  medicine: genMedImg,
  vitamins: vitaminsImg,
  water: waterImg,
  treats: treatsImg,
  premium_feed: premFeedImg,
  basic_medicine: basicMedImg,
  advanced_medicine: advMedImg,
  feed: feedImg,
};

const Market = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState("animals");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchaseMessage, setPurchaseMessage] = useState(null);
  const [purchaseStatus, setPurchaseStatus] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [animalName, setAnimalName] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const { triggerRefresh } = useRefresh();

  // Market items
  const marketItems = {
    animals: [
      {
        id: "cat",
        type: "cat",
        name: "Cat",
        price: 100,
        description: "A friendly companion for your farm.",
      },
      {
        id: "dog",
        type: "dog",
        name: "Dog",
        price: 150,
        description: "A loyal friend and guardian.",
      },
      {
        id: "chicken",
        type: "chicken",
        name: "Chicken",
        price: 50,
        description: "Provides eggs and meat.",
      },
      {
        id: "cow",
        type: "cow",
        name: "Cow",
        price: 300,
        description: "Provides milk and meat.",
      },
      {
        id: "horse",
        type: "horse",
        name: "Horse",
        price: 500,
        description: "A majestic and fast animal.",
      },
      {
        id: "pig",
        type: "pig",
        name: "Pig",
        price: 200,
        description: "Provides meat and is easy to care for.",
      },
      {
        id: "sheep",
        type: "sheep",
        name: "Sheep",
        price: 250,
        description: "Provides wool and meat.",
      },
    ],
    supplies: [
      {
        id: "dogFood",
        type: "dogFood",
        name: "Dog Food",
        price: 20,
        quantity: 10,
        description: "Nutritious food for your dogs.",
      },
      {
        id: "catFood",
        type: "catFood",
        name: "Cat Food",
        price: 15,
        quantity: 10,
        description: "Tasty food for your cats.",
      },
      {
        id: "livestockFeed",
        type: "livestockFeed",
        name: "Livestock Feed",
        price: 10,
        quantity: 10,
        description: "Basic food for your livestock animals.",
      },
      {
        id: "feed",
        type: "feed",
        name: "Animal Feed",
        price: 20,
        quantity: 10,
        description: "Basic food for your animals.",
      },
      {
        id: "premium_feed",
        type: "premium_feed",
        name: "Premium Feed",
        price: 50,
        quantity: 10,
        description: "High-quality food that improves animal health.",
      },
      {
        id: "water",
        type: "water",
        name: "Fresh Water",
        price: 5,
        quantity: 20,
        description: "Clean water for your animals.",
      },
      {
        id: "treats",
        type: "treats",
        name: "Animal Treats",
        price: 10,
        quantity: 5,
        description: "Special treats for your pets.",
      },
    ],
    medicine: [
      {
        id: "medicine",
        type: "medicine",
        name: "General Medicine",
        price: 50,
        quantity: 5,
        description: "Treats health issues for all animals.",
      },
      {
        id: "basic_medicine",
        type: "basic_medicine",
        name: "Basic Medicine",
        price: 30,
        quantity: 5,
        description: "Treats minor health issues.",
      },
      {
        id: "advanced_medicine",
        type: "advanced_medicine",
        name: "Advanced Medicine",
        price: 80,
        quantity: 5,
        description: "Treats serious health issues.",
      },
      {
        id: "vitamins",
        type: "vitamins",
        name: "Animal Vitamins",
        price: 40,
        quantity: 10,
        description: "Improves overall animal health.",
      },
    ],
  };

  const handlePurchaseClick = (item) => {
    // Check if it's a pet (cat, dog, or horse)
    if (
      activeCategory === "animals" &&
      ["cat", "dog", "horse"].includes(item.type.toLowerCase())
    ) {
      setSelectedAnimal(item);
      setAnimalName(""); // Set to empty string instead of item.name
      setShowNameInput(true);
    } else {
      // For livestock or non-animals, proceed with purchase directly
      handlePurchase(item);
    }
  };

  const handleNameSubmit = () => {
    if (animalName.trim()) {
      // Proceed with purchase using the custom name
      handlePurchase({ ...selectedAnimal, name: animalName });
      setShowNameInput(false);
      setAnimalName("");
      setSelectedAnimal(null);
    }
  };

  const handlePurchase = async (item) => {
    // Check if user has enough currency
    if (currentUser.currency < item.price) {
      setPurchaseMessage(`Not enough coins! You need ${item.price} coins.`);
      setPurchaseStatus("error");
      setTimeout(() => {
        setPurchaseMessage(null);
        setPurchaseStatus("");
      }, 3000);
      return;
    }

    setLoading(true);
    setPurchaseMessage(`Purchasing ${item.name}...`);
    setPurchaseStatus("");

    try {
      let response;

      // Determine what type of item is being purchased
      if (activeCategory === "animals") {
        // Determine the correct category based on animal type
        const isPet = ["cat", "dog", "horse"].includes(item.type.toLowerCase());
        const category = isPet ? "pet" : "livestock";

        // Call API to purchase animal
        response = await createAnimal({
          type: item.type,
          name: item.name, // This will be the custom name for pets
          price: item.price,
          category: category,
        });
      } else {
        // For inventory items, send the complete item data
        response = await buyInventory({
          type: item.type, // This should match exactly with the enum in the model
          name: item.name,
          quantity: item.quantity || 1,
          price: item.price,
          unit: "units", // Default unit
        });
      }

      // Update user currency with the value returned from the server
      if (response.user && response.user.currency !== undefined) {
        updateUser({ ...currentUser, currency: response.user.currency });
      } else {
        // Fallback to client-side calculation if server doesn't return updated user
        const newCurrency = currentUser.currency - item.price;
        updateUser({ ...currentUser, currency: newCurrency });
      }

      setPurchaseMessage(`Successfully purchased ${item.name}!`);
      setPurchaseStatus("success");
      setTimeout(() => {
        setPurchaseMessage(null);
        setPurchaseStatus("");
      }, 3000);

      triggerRefresh(); // Trigger refresh after purchase
    } catch (error) {
      console.error(`Error buying ${item.type}:`, error);

      // Check if it's an authentication error
      if (error.response && error.response.status === 401) {
        setPurchaseMessage("Your session has expired. Please log in again.");
        setPurchaseStatus("error");
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 3000);
      } else {
        // Show more detailed error message if available
        const errorMessage =
          error.response && error.response.data && error.response.data.error
            ? error.response.data.error
            : "Failed to purchase item. Please try again.";

        setPurchaseMessage(errorMessage);
        setPurchaseStatus("error");
        setTimeout(() => {
          setPurchaseMessage(null);
          setPurchaseStatus("");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const getItemImage = (item) => {
    if (
      activeCategory === "animals" &&
      item.type &&
      animalImages[item.type.toLowerCase()]
    ) {
      return animalImages[item.type.toLowerCase()];
    } else if (
      (activeCategory === "supplies" || activeCategory === "medicine") &&
      item.type &&
      inventoryImages[item.type]
    ) {
      return inventoryImages[item.type];
    }
    return null;
  };

  return (
    <div className="market-container">
      <div className="market-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          &larr; Back to Dashboard
        </button>
        <h1>Farmer's Market</h1>
        <div className="user-currency">
          Your Coins:{" "}
          <span className="currency-amount">${currentUser.currency}</span>
        </div>
      </div>

      <div className="market-categories">
        <button
          className={`category-button ${
            activeCategory === "animals" ? "active" : ""
          }`}
          onClick={() => setActiveCategory("animals")}
        >
          Animals
        </button>
        <button
          className={`category-button ${
            activeCategory === "supplies" ? "active" : ""
          }`}
          onClick={() => setActiveCategory("supplies")}
        >
          Supplies
        </button>
        <button
          className={`category-button ${
            activeCategory === "medicine" ? "active" : ""
          }`}
          onClick={() => setActiveCategory("medicine")}
        >
          Medicine
        </button>
      </div>

      {showNameInput && (
        <div className="name-input-modal">
          <div className="name-input-content">
            <h3>Name Your New Pet</h3>
            <p>Please give your new {selectedAnimal?.type} a name:</p>
            <input
              type="text"
              value={animalName}
              onChange={(e) => setAnimalName(e.target.value)}
              placeholder="Enter pet name"
              className="pet-name-input"
            />
            <div className="name-input-buttons">
              <button
                className="cancel-button"
                onClick={() => {
                  setShowNameInput(false);
                  setAnimalName("");
                  setSelectedAnimal(null);
                }}
              >
                Cancel
              </button>
              <button
                className="confirm-button"
                onClick={handleNameSubmit}
                disabled={!animalName.trim()}
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {purchaseMessage && (
        <div className={`purchase-message ${purchaseStatus}`}>
          {purchaseMessage}
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Processing purchase..." />
      ) : (
        <div className="market-items">
          {marketItems[activeCategory].map((item) => (
            <div key={item.id} className="market-item">
              <div className="item-image-container">
                {getItemImage(item) ? (
                  <img
                    src={getItemImage(item)}
                    alt={item.name}
                    className="item-image"
                  />
                ) : (
                  <div
                    className="item-image-placeholder"
                    style={{
                      backgroundColor:
                        activeCategory === "animals"
                          ? "var(--color-light-green)"
                          : activeCategory === "supplies"
                          ? "var(--color-light-yellow)"
                          : "var(--color-soft-pink)",
                    }}
                  >
                    {item.name}
                  </div>
                )}
              </div>
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                {item.quantity && (
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                )}
                <div className="item-price-container">
                  <span className="item-price">
                    {activeCategory !== "animals" && item.quantity > 1 ? (
                      <>
                        ${item.price} each (Total: ${item.price * item.quantity}
                        )
                      </>
                    ) : (
                      <>${item.price}</>
                    )}
                  </span>
                  <button
                    className="purchase-button"
                    onClick={() => handlePurchaseClick(item)}
                    disabled={currentUser.currency < item.price}
                  >
                    {currentUser.currency < item.price
                      ? "Not enough coins"
                      : "Purchase"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Market;
