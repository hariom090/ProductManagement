// src/pages/AdminLogin/AdminLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate ,Link} from "react-router-dom";
import './adminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/admin/login", {
        email,
        password,
      });

      // Save token and role
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("role", res.data.role);

      setSuccess("✅ Login successful! Redirecting...");

      // Redirect after short delay
      setTimeout(() => {
        navigate("/"); // Redirect to admin panel
      }, 1500);

    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError("❌ Invalid email or password");
      } else {
        setError("❌ Server error. Please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Admin Login</h2>

        {success && <p className="login-success">{success}</p>}
        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

          <div className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
