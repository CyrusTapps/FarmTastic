import { useAuth } from "../../context/AuthContext";
import "./FarmHeader.css";

const FarmHeader = ({ onLogout }) => {
  const { currentUser } = useAuth();

  return (
    <header className="farm-header">
      <h1>{currentUser?.farmName || "My Farm"}</h1>
      <div className="farm-header-right">
        <div className="currency-display">${currentUser?.currency || 0}</div>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default FarmHeader;
