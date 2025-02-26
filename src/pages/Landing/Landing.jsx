import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to FarmTastic</h1>
        <p className="tagline">
          Your virtual farm management adventure begins here!
        </p>

        <div className="cta-buttons">
          <button className="login-button" onClick={() => navigate("/")}>
            Login
          </button>
          <button
            className="register-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

        <div className="farm-features">
          <h2>Manage Your Farm</h2>
          <ul>
            <li>Care for various animals</li>
            <li>Monitor animal health</li>
            <li>Buy and sell at the Farmer's Market</li>
            <li>Track your farm's growth over time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Landing;
