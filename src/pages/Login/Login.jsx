import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

console.log("Initializing Login page component...");

const Login = () => {
  console.log("Rendering Login page");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, error: authError } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Login form submitted");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      console.log("Attempting login with email:", formData.email);
      await login(formData.email, formData.password);
      console.log("Login successful, navigating to dashboard");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login component - Login error:", err);
      // Error is already set in the auth context, but we can add more specific handling here if needed
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login to FarmTastic</h2>
        <p>Welcome back! Please login to your account</p>

        {(error || authError) && (
          <div className="error-message">{error || authError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

console.log("Login page component initialized successfully");

export default Login;
