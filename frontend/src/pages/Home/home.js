import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css"; // import the css

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and role
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");

    // Redirect to login page
    navigate("/admin-login");
  };

  return (
    <div className="home-container">
      <div className="home-card">
        {/* Top bar with logout */}
        <div className="home-header">
          <h1 className="home-title">Admin Dashboard</h1>
         
        </div>

        <p className="home-subtitle">Manage your store easily</p>

        <div className="home-btn-group">
          <button
            onClick={() => navigate("/admin/products")}
            className="home-btn home-btn-products"
          >
            Manage Products
          </button>
          <button
            onClick={() => navigate("/admin/add-products")}
            className="home-btn home-btn-add-products"
          >
            Add Products
          </button>
          <button
            onClick={() => navigate("/admin/orders")}
            className="home-btn home-btn-orders"
          >
            Manage Orders
          </button>
          <button
            onClick={() => navigate("/admin/head-admin")}
            className="home-btn home-btn-users"
          >
            Manage Admins
          </button>
           <button onClick={handleLogout} className="home-btn home-btn-logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
