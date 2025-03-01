import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRefresh } from "../../context/RefreshContext";
import FarmHeader from "../../components/FarmHeader/FarmHeader";
import AssetList from "../../components/AssetList/AssetList";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { getAnimals } from "../../services/animalService";
import { getInventory } from "../../services/inventoryService";
import { getTransactions } from "../../services/transactionService";
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
  const [deadAnimals, setDeadAnimals] = useState([]);
  const [showDeadAnimalModal, setShowDeadAnimalModal] = useState(false);
  const [acknowledgedDeaths, setAcknowledgedDeaths] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem("acknowledgedDeaths");
    return saved ? JSON.parse(saved) : [];
  });

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
        console.log("Full animals response:", animalsResponse);

        if (isMounted) {
          // Handle different response structures
          if (animalsResponse.data) {
            console.log(
              `Dashboard - Fetch #${currentFetchCount}: Received ${animalsResponse.data.length} animals`
            );
            setAnimals(animalsResponse.data);
          } else if (animalsResponse.success && animalsResponse.data) {
            console.log(
              `Dashboard - Fetch #${currentFetchCount}: Received ${animalsResponse.data.length} animals`
            );
            setAnimals(animalsResponse.data);
          }

          // Check for dead animals in different possible response structures
          let newDeadAnimals = [];

          if (
            animalsResponse.deadAnimals &&
            animalsResponse.deadAnimals.length > 0
          ) {
            console.log(
              "Dead animals detected in response.deadAnimals:",
              animalsResponse.deadAnimals
            );
            newDeadAnimals = animalsResponse.deadAnimals;
          } else if (
            animalsResponse.data &&
            animalsResponse.data.deadAnimals &&
            animalsResponse.data.deadAnimals.length > 0
          ) {
            console.log(
              "Dead animals detected in response.data.deadAnimals:",
              animalsResponse.data.deadAnimals
            );
            newDeadAnimals = animalsResponse.data.deadAnimals;
          }

          // Only show modal if there are new dead animals that haven't been acknowledged
          if (newDeadAnimals.length > 0) {
            // Filter out already acknowledged deaths
            const unacknowledgedDeaths = newDeadAnimals.filter(
              (death) => !acknowledgedDeaths.includes(death._id)
            );

            if (unacknowledgedDeaths.length > 0) {
              setDeadAnimals(unacknowledgedDeaths);
              setShowDeadAnimalModal(true);
            }
          }
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

        // Fetch recent transactions to check for dead animals
        console.log(
          `Dashboard - Fetch #${currentFetchCount}: Getting recent transactions`
        );
        const transactionsResponse = await getTransactions(10);
        console.log("Transactions response:", transactionsResponse);

        if (isMounted && transactionsResponse.data) {
          // Filter for animal death transactions in the last 24 hours
          const recentDeaths = transactionsResponse.data.filter(
            (transaction) =>
              transaction.type === "sell" && // Using 'sell' type for deaths
              transaction.description &&
              transaction.description.includes("died") &&
              new Date(transaction.createdAt) >
                new Date(Date.now() - 24 * 60 * 60 * 1000)
          );

          console.log("Recent deaths from transactions:", recentDeaths);

          if (recentDeaths.length > 0) {
            // Filter out already acknowledged deaths
            const unacknowledgedDeaths = recentDeaths.filter(
              (death) => !acknowledgedDeaths.includes(death._id)
            );

            if (unacknowledgedDeaths.length > 0) {
              setDeadAnimals((prevDeaths) => {
                // Combine with any deaths from animal response, avoiding duplicates
                const allDeathIds = new Set(prevDeaths.map((d) => d._id));
                const newDeaths = unacknowledgedDeaths.filter(
                  (d) => !allDeathIds.has(d._id)
                );
                return [...prevDeaths, ...newDeaths];
              });
              setShowDeadAnimalModal(true);
            }
          }
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
  }, [refreshTrigger, acknowledgedDeaths]); // Re-fetch when refreshTrigger or acknowledgedDeaths changes

  // Save acknowledged deaths to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "acknowledgedDeaths",
      JSON.stringify(acknowledgedDeaths)
    );
  }, [acknowledgedDeaths]);

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

  const handleCloseModal = () => {
    console.log(
      "Acknowledging deaths:",
      deadAnimals.map((animal) => animal._id)
    );
    // Add current dead animal IDs to acknowledged list
    setAcknowledgedDeaths((prev) => [
      ...prev,
      ...deadAnimals.map((animal) => animal._id),
    ]);
    setShowDeadAnimalModal(false);
    setDeadAnimals([]);
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

      {/* Dead Animal Modal */}
      {showDeadAnimalModal && (
        <div className="modal-overlay">
          <div className="dead-animal-modal">
            <h2>Animal Death Notice</h2>
            <p>The following animals have died due to neglect:</p>
            <ul className="dead-animal-list">
              {deadAnimals.map((animal) => (
                <li key={animal._id} className="dead-animal-item">
                  {animal.itemName || animal.name || "An animal"} -{" "}
                  {new Date(animal.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
            <p className="dead-animal-message">
              Remember to feed and water your animals regularly to keep them
              healthy!
            </p>
            <button className="close-modal-button" onClick={handleCloseModal}>
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

console.log("Dashboard page component initialized successfully");

export default Dashboard;
