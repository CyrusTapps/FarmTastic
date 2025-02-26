import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

console.log("Initializing Register page component...");

const Register = () => {
  console.log("Rendering Register page");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  // Combine local and auth context errors
  const displayError = error || authError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Register form submitted");

    // Simple validation
    if (!username || !email || !password || !confirmPassword) {
      console.log("Register validation failed: missing fields");
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Register validation failed: passwords do not match");
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      console.log("Register validation failed: password too short");
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      console.log(
        `Attempting registration for username: ${username}, email: ${email}`
      );
      setIsLoading(true);
      setError("");

      await register(username, email, password);
      console.log("Registration successful, navigating to dashboard");
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration submission error:", err);
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    // Clear errors when user starts typing
    if (error) setError("");
  };

  console.log("Register page rendered, has error:", !!displayError);

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Join FarmTastic!</h2>
        <p>Create an account to start your farming adventure</p>

        {displayError && <div className="error-message">{displayError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleInputChange(setUsername)}
              placeholder="Choose a username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              placeholder="Create a password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange(setConfirmPassword)}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

console.log("Register page component initialized successfully");

export default Register;
