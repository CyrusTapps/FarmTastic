import { useNavigate } from "react-router-dom";
import "./MarketButton.css";

const MarketButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/market");
  };

  return (
    <button className="market-button" onClick={handleClick}>
      Farmer's Market
    </button>
  );
};

export default MarketButton;
