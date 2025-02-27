import AssetCard from "../AssetCard/AssetCard";
import "./AssetList.css";

const AssetList = ({ assets, title }) => {
  return (
    <div className="asset-list">
      <h2 className="asset-list-title">{title || "Assets"}</h2>

      <div className="asset-grid">
        {assets.map((asset) => (
          <AssetCard key={asset._id || asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default AssetList;
