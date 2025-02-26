import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import FarmHeader from "../../components/FarmHeader/FarmHeader";
import AssetList from "../../components/AssetList/AssetList";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { getAnimals } from "../../services/animalService";
import { getInventory } from "../../services/inventoryService";
import "./Dashboard.css";

console.log("Initializing Dashboard page component...");

const Dashboard = () => {
  console.log("Rendering Dashboard page");
  const { currentUser, logout, updateUser } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch animals
        const animalsResponse = await getAnimals();
        setAnimals(animalsResponse.data);

        // Fetch inventory
        const inventoryResponse = await getInventory();
        setInventory(inventoryResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load farm data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(
    "Dashboard - Current user:",
    currentUser ? `${currentUser.username} (${currentUser._id})` : "none"
  );

  const handleLogout = async () => {
    console.log("Dashboard - Logout button clicked");
    try {
      await logout();
      console.log("Dashboard - Logout successful");
    } catch (error) {
      console.error("Dashboard - Logout error:", error);
    }
  };

  if (!currentUser) {
    console.log(
      "Dashboard - No user found, should not happen due to ProtectedRoute"
    );
    return <div>Loading user data...</div>;
  }

  // Create market "asset" for the Farmer's Market button
  const marketAsset = {
    id: "market",
    type: "market",
    name: "Farmer's Market",
  };

  console.log("Dashboard - Rendering with user data");

  return (
    <div className="dashboard-container">
      <FarmHeader onLogout={handleLogout} />

      <div className="dashboard-content">
        <div className="welcome-message">
          <h2>Welcome to Your Farm, {currentUser.username}!</h2>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading your farm..." />
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {animals.length > 0 ? (
              <AssetList assets={animals} title="Your Animals" />
            ) : (
              <div className="empty-state">
                <p>
                  You don't have any animals yet. Visit the Farmer's Market to
                  get started!
                </p>
              </div>
            )}

            {inventory.length > 0 && (
              <AssetList assets={inventory} title="Your Inventory" />
            )}

            <AssetList assets={[marketAsset]} title="Market" />
          </>
        )}
      </div>
    </div>
  );
};

console.log("Dashboard page component initialized successfully");

export default Dashboard;
