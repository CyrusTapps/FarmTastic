import { useNavigate } from "react-router-dom";
import "./AssetCard.css";

const AssetCard = ({ asset }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (asset.type === "market") {
      navigate("/market");
    } else {
      navigate(`/asset/${asset._id}`);
    }
  };

  // Determine if this is a living asset (has health)
  const isLivingAsset = asset.health !== undefined;

  // Determine health color based on percentage
  const getHealthColor = (health) => {
    if (health >= 75) return "var(--color-green)";
    if (health >= 50) return "var(--color-yellow)";
    return "var(--color-red)";
  };

  return (
    <div
      className={`asset-card ${asset.type === "market" ? "market-card" : ""}`}
      onClick={handleClick}
    >
      <div className="asset-image-container">
        <div
          className="asset-image"
          style={{
            backgroundColor:
              asset.type === "market"
                ? "var(--color-soft-pink)"
                : "var(--color-light-green)",
          }}
        >
          {/* Placeholder for actual images */}
        </div>
      </div>

      <div className="asset-info">
        <h3 className="asset-name">
          {asset.type === "market"
            ? "Farmer's Market"
            : asset.name || asset.type}
        </h3>

        {isLivingAsset && (
          <div className="asset-health">
            Health:{" "}
            <span style={{ color: getHealthColor(asset.health) }}>
              {asset.health}%
            </span>
          </div>
        )}

        {asset.quantity !== undefined && (
          <div className="asset-quantity">
            Quantity: {asset.quantity}
            {asset.unit ? ` ${asset.unit}` : ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
