import "./SplashScreen.css";

const SplashScreen = () => {
  console.log("🚀 SplashScreen - Component rendering");

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="logo">
          <span className="logo-letter">F</span>
          <span className="logo-text">armTastic</span>
        </div>

        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your farm experience...</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
