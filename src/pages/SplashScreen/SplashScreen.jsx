import "./SplashScreen.css";

const SplashScreen = () => {
  console.log("🚀 SplashScreen - Component rendering");

  // You can update this version number as needed
  const appVersion = "v1.0.0";
  const currentYear = new Date().getFullYear();

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

      <div className="copyright-container">
        <p className="copyright-text">
          &copy; {currentYear} Shawn 'Cyrus' Tapps. All rights reserved.
        </p>
        <p className="version-text">{appVersion}</p>
      </div>
    </div>
  );
};

export default SplashScreen;
