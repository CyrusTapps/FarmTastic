import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getInventoryItem,
  buyInventory,
  sellInventory,
} from "../../services/inventoryService";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useRefresh } from "../../context/RefreshContext";
import "./InventoryDetail.css";
import DebugMonitor from "../../components/DebugMonitor";

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

const InventoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const [inventoryItem, setInventoryItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [sellQuantity, setSellQuantity] = useState(1);
  const { triggerRefresh } = useRefresh();

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

  // Fetch inventory item data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch inventory item data
        const response = await getInventoryItem(id);
        setInventoryItem(response.data);

        // Default sell quantity to 1 or max available if less than 1
        setSellQuantity(Math.min(1, response.data.quantity));

        setLoading(false);
      } catch (error) {
        console.error(`Error fetching inventory item:`, error);
        setError("Failed to load inventory item. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle buy more action
  const handleBuyMore = async () => {
    try {
      setActionInProgress(true);
      setActionMessage("Purchasing...");

      const response = await buyInventory({
        type: inventoryItem.type,
        quantity: purchaseQuantity,
      });

      // Update inventory item with new data
      setInventoryItem(response.data.inventory);

      // Update user currency
      if (response.data.user && response.data.user.currency !== undefined) {
        updateUser({ ...currentUser, currency: response.data.user.currency });
      }

      setActionMessage(`Purchased ${purchaseQuantity} ${inventoryItem.name}!`);
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
      triggerRefresh();
    } catch (error) {
      console.error(`Error buying inventory:`, error);
      setActionMessage(
        error.response?.data?.error || "Failed to purchase item."
      );
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    }
  };

  // Handle sell action
  const handleSell = async () => {
    if (sellQuantity <= 0 || sellQuantity > inventoryItem.quantity) {
      setActionMessage("Invalid quantity to sell.");
      setTimeout(() => setActionMessage(null), 2000);
      return;
    }

    try {
      setActionInProgress(true);
      setActionMessage("Selling...");

      const response = await sellInventory(id, sellQuantity);

      // If we sold all items, navigate back to dashboard
      if (sellQuantity >= inventoryItem.quantity) {
        setActionMessage(
          `Sold all ${inventoryItem.name} for $${response.data.sellingPrice}!`
        );
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        // Update inventory item with new data
        setInventoryItem(response.data.inventory);
        setActionMessage(
          `Sold ${sellQuantity} ${inventoryItem.name} for $${response.data.sellingPrice}!`
        );
        setTimeout(() => setActionMessage(null), 2000);
      }

      // Update user currency
      if (response.data.user && response.data.user.currency !== undefined) {
        updateUser({ ...currentUser, currency: response.data.user.currency });
      }

      setActionInProgress(false);
      triggerRefresh();
    } catch (error) {
      console.error(`Error selling inventory:`, error);
      setActionMessage(error.response?.data?.error || "Failed to sell item.");
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate("/dashboard");
  };

  // Format time since last purchase
  const getTimeSinceLastPurchase = (timestamp) => {
    if (!timestamp) return "Never";

    const lastPurchase = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - lastPurchase) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - lastPurchase) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  };

  // Get the appropriate image for this inventory item
  const getInventoryImage = () => {
    if (
      inventoryItem &&
      inventoryItem.type &&
      inventoryImages[inventoryItem.type]
    ) {
      return inventoryImages[inventoryItem.type];
    }
    return null;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="inventory-detail-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!inventoryItem) {
    return (
      <div className="inventory-detail-container">
        <div className="error-message">Inventory item not found.</div>
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Calculate selling price (80% of purchase price)
  const sellingPrice = Math.round(inventoryItem.price * 0.8);

  return (
    <div className="inventory-detail-container">
      <DebugMonitor componentName="InventoryDetail" />
      <button className="back-button" onClick={handleBack}>
        &larr; Back to Dashboard
      </button>

      <div className="inventory-detail-card">
        <div className="inventory-header">
          <h1>{inventoryItem.name}</h1>
          <div className="inventory-price">Price: ${inventoryItem.price}</div>
        </div>

        <div className="inventory-image-container">
          <div className="inventory-image">
            {getInventoryImage() ? (
              <img
                src={getInventoryImage()}
                alt={inventoryItem.name}
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
                {inventoryItem.type}
              </div>
            )}
          </div>
        </div>

        <div className="inventory-info">
          <div className="info-row">
            <span className="info-label">Type:</span>
            <span className="info-value">{inventoryItem.type}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Quantity:</span>
            <span className="info-value">
              {inventoryItem.quantity} {inventoryItem.unit || "units"}
            </span>
          </div>

          {inventoryItem.createdAt && (
            <div className="info-row">
              <span className="info-label">First Purchased:</span>
              <span className="info-value">
                {getTimeSinceLastPurchase(inventoryItem.createdAt)}
              </span>
            </div>
          )}

          {inventoryItem.updatedAt && (
            <div className="info-row">
              <span className="info-label">Last Updated:</span>
              <span className="info-value">
                {getTimeSinceLastPurchase(inventoryItem.updatedAt)}
              </span>
            </div>
          )}

          <div className="info-row">
            <span className="info-label">Sell Value:</span>
            <span className="info-value">${sellingPrice} per unit</span>
          </div>
        </div>

        <div className="action-message-container">
          {actionMessage && (
            <div className="action-message">{actionMessage}</div>
          )}
        </div>

        <div className="inventory-actions">
          <div className="quantity-control">
            <label htmlFor="purchase-quantity">Buy Quantity:</label>
            <input
              id="purchase-quantity"
              type="number"
              min="1"
              value={purchaseQuantity}
              onChange={(e) =>
                setPurchaseQuantity(parseInt(e.target.value) || 1)
              }
              disabled={actionInProgress}
            />
            <button
              className="action-button buy-button"
              onClick={handleBuyMore}
              disabled={
                actionInProgress ||
                currentUser.currency < inventoryItem.price * purchaseQuantity
              }
            >
              Buy More (${inventoryItem.price * purchaseQuantity})
            </button>
          </div>

          <div className="quantity-control">
            <label htmlFor="sell-quantity">Sell Quantity:</label>
            <input
              id="sell-quantity"
              type="number"
              min="1"
              max={inventoryItem.quantity}
              value={sellQuantity}
              onChange={(e) => setSellQuantity(parseInt(e.target.value) || 1)}
              disabled={actionInProgress}
            />
            <button
              className="action-button sell-button"
              onClick={handleSell}
              disabled={
                actionInProgress || inventoryItem.quantity < sellQuantity
              }
            >
              Sell (${sellingPrice * sellQuantity})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetail;
