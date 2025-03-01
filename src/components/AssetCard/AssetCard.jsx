import { useNavigate } from "react-router-dom";
import "./AssetCard.css";

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

// Import UI images
import marketImg from "../../assets/images/ui/market.png";

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
  market: marketImg,
};

const AssetCard = ({ asset }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (asset.type === "market") {
      navigate("/market");
    } else if (
      asset.type &&
      ["cat", "chicken", "cow", "dog", "horse", "pig", "sheep"].includes(
        asset.type.toLowerCase()
      )
    ) {
      navigate(`/animal/${asset._id}`);
    } else {
      navigate(`/inventory/${asset._id}`);
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

  // Get the appropriate image for this asset
  const getAssetImage = () => {
    if (asset.type === "market") {
      return marketImg;
    } else if (asset.type && animalImages[asset.type.toLowerCase()]) {
      return animalImages[asset.type.toLowerCase()];
    } else if (asset.type && inventoryImages[asset.type]) {
      return inventoryImages[asset.type];
    } else return null;
  };

  return (
    <div
      className={`asset-card ${asset.type === "market" ? "market-card" : ""}`}
      onClick={handleClick}
    >
      <div className="asset-image-container">
        {getAssetImage() ? (
          <div
            className="asset-image"
            style={{
              backgroundImage: `url(${getAssetImage()})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <div
            className="asset-image"
            style={{
              backgroundColor:
                asset.type === "market"
                  ? "var(--color-soft-pink)"
                  : "var(--color-light-green)",
            }}
          >
            <div className="asset-image-placeholder">
              {asset.type || "Item"}
            </div>
          </div>
        )}
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
