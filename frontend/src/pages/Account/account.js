import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./account.css";

const AccountPage = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");
 

  useEffect(() => {
    const fetchAdmin = async () => {
      try { 
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
      } catch(err) {
        console.error(err);
        setError("Failed to load account details");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="account-container">
      <h2 className="account-title">My Account</h2>

      {error && <p className="message error">{error}</p>}

      {admin && (
        <div className="account-info">
          <p><strong>Name:</strong> {admin.fullName}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Role:</strong> {admin.role}</p>
        </div>
      )}

      <button 
        className="account-btn" 
        onClick={() => navigate("/admin/change-password")}
      >
        Change Password
      </button>
    </div>
  );
};

export default AccountPage;
