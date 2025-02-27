import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRefresh } from "../../context/RefreshContext";
import FarmHeader from "../../components/FarmHeader/FarmHeader";
import AssetList from "../../components/AssetList/AssetList";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { getAnimals } from "../../services/animalService";
import { getInventory } from "../../services/inventoryService";
import DebugMonitor from "../../components/DebugMonitor";
import TransactionList from "../../components/TransactionList/TransactionList";
import "./Dashboard.css";

console.log("Initializing Dashboard page component...");

const Dashboard = () => {
  console.log("Rendering Dashboard page");
  const { currentUser, logout, updateUser } = useAuth();
  const { refreshTrigger } = useRefresh();
  const [animals, setAnimals] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API - triggered on mount, every 5 minutes, and when refreshTrigger changes
  useEffect(() => {
    let isMounted = true;
    let fetchCount = 0;

    console.log(
      `Dashboard - Setting up data fetching (refreshTrigger: ${refreshTrigger})`
    );

    const fetchData = async () => {
      if (!isMounted) return;

      const currentFetchCount = ++fetchCount;
      console.log(`Dashboard - Starting fetch #${currentFetchCount}`);

      try {
        setLoading(true);
        setError(null);

        // Fetch animals
        console.log(`Dashboard - Fetch #${currentFetchCount}: Getting animals`);
        const animalsResponse = await getAnimals();
        if (isMounted) {
          console.log(
            `Dashboard - Fetch #${currentFetchCount}: Received ${animalsResponse.data.length} animals`
          );
          setAnimals(animalsResponse.data);
        }

        // Fetch inventory
        console.log(
          `Dashboard - Fetch #${currentFetchCount}: Getting inventory`
        );
        const inventoryResponse = await getInventory();
        if (isMounted) {
          console.log(
            `Dashboard - Fetch #${currentFetchCount}: Received ${inventoryResponse.data.length} inventory items`
          );
          setInventory(inventoryResponse.data);
        }

        if (isMounted) {
          console.log(`Dashboard - Fetch #${currentFetchCount}: Complete`);
          setLoading(false);
        }
      } catch (error) {
        console.error(`Dashboard - Fetch #${currentFetchCount}: Error:`, error);
        if (isMounted) {
          setError("Failed to load farm data. Please try again.");
          setLoading(false);
        }
      }
    };

    fetchData();

    // Set up a reasonable polling interval (5 minutes)
    console.log(`Dashboard - Setting up interval (5 minutes)`);
    const intervalId = setInterval(() => {
      console.log(`Dashboard - Interval triggered`);
      fetchData();
    }, 5 * 60 * 1000);

    return () => {
      console.log(`Dashboard - Cleaning up effect`);
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

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
      <DebugMonitor componentName="Dashboard" />
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

            <TransactionList limit={5} />
          </>
        )}
      </div>
    </div>
  );
};

console.log("Dashboard page component initialized successfully");

export default Dashboard;
