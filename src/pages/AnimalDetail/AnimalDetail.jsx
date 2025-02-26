import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getAnimal,
  feedAnimal,
  waterAnimal,
  callVet,
  sellAnimal,
} from "../../services/animalService";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./AnimalDetail.css";

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Fetch animal data
  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAnimal(id);
        setAnimal(response.data);

        setLoading(false);
      } catch (error) {
        console.error(`Error fetching animal ${id}:`, error);
        setError("Failed to load animal data. Please try again.");
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  // Handle feed action
  const handleFeed = async () => {
    try {
      setActionInProgress(true);
      setActionMessage("Feeding...");

      const response = await feedAnimal(id);
      setAnimal(response.data.animal);

      setActionMessage("Fed successfully!");
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    } catch (error) {
      console.error(`Error feeding animal ${id}:`, error);
      setActionMessage("Failed to feed animal.");
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    }
  };

  // Handle water action
  const handleWater = async () => {
    try {
      setActionInProgress(true);
      setActionMessage("Watering...");

      const response = await waterAnimal(id);
      setAnimal(response.data.animal);

      setActionMessage("Watered successfully!");
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    } catch (error) {
      console.error(`Error watering animal ${id}:`, error);
      setActionMessage("Failed to water animal.");
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
    } catch (error) {
      console.error(`Error calling vet for animal ${id}:`, error);
      setActionMessage(error.response?.data?.error || "Failed to call vet.");
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    }
  };

  // Handle sell action
  const handleSell = async () => {
    if (
      !confirm(`Are you sure you want to sell ${animal.name || animal.type}?`)
    ) {
      return;
    }

    try {
      setActionInProgress(true);
      setActionMessage("Selling...");

      const response = await sellAnimal(id);

      // Update user currency
      if (response.data.user && response.data.user.currency !== undefined) {
        updateUser({ ...currentUser, currency: response.data.user.currency });
      }

      setActionMessage(`Sold for $${response.data.sellingPrice}!`);
      setTimeout(() => {
        setActionMessage(null);
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(`Error selling animal ${id}:`, error);
      setActionMessage("Failed to sell animal.");
      setTimeout(() => setActionMessage(null), 2000);
      setActionInProgress(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate("/dashboard");
  };

  // Calculate time since last care
  const getTimeSinceLastCare = (timestamp) => {
    const now = new Date();
    const lastCare = new Date(timestamp);
    const diffInHours = Math.floor((now - lastCare) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours === 1) {
      return "1 hour ago";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return days === 1 ? "1 day ago" : `${days} days ago`;
    }
  };

  // Get health color based on percentage
  const getHealthColor = (health) => {
    if (health >= 75) return "var(--color-green)";
    if (health >= 50) return "var(--color-yellow)";
    return "var(--color-red)";
  };

  if (loading) {
    return <LoadingSpinner message="Loading animal data..." />;
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
          <div
            className="animal-image"
            style={{ backgroundColor: "var(--color-light-green)" }}
          >
            {/* Placeholder for actual image */}
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
            Give {animal.name || animal.type} Water
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
    </div>
  );
};

export default AnimalDetail;
