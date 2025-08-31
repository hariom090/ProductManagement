import React, { useEffect, useState } from "react";
import axios from "axios";
import "./headAdminPanel.css";

const HeadAdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [currentAdminId, setCurrentAdminId] = useState(null);
  const token = localStorage.getItem("adminToken"); // stored after login

  // Fetch current logged-in admin details
  const fetchCurrentAdmin = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(res.data.role);
      setCurrentAdminId(res.data._id); // store logged-in admin ID
    } catch (err) {
      console.error("Error fetching current admin:", err);
      setRole("unauthorized");
    }
  };

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update role
  const updateRole = async (id, role) => {
    try {
      await axios.put(
        `http://localhost:5000/admin/update-role/${id}`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating role");
    }
  };

  // Delete admin
  const deleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await axios.delete(`http://localhost:5000/admin/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting admin");
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentAdmin();
    } else {
      setRole("unauthorized");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === "head-admin") {
      fetchAdmins();
    } else if (role === "unauthorized" || role === "admin") {
      setLoading(false);
    }
  }, [role]);

  if (loading) return <h2>Loading...</h2>;
  if (role !== "head-admin")
    return <h2>Access Denied. Only Head Admins can view this page.</h2>;

  return (
    <div className="head-admin-container">
      <h1>Admin Management</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {admins
            .filter((admin) => admin._id !== currentAdminId) // exclude current head admin
            .map((admin) => (
              <tr key={admin._id}>
                <td>{admin.fullName}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
                <td>
                  <select
                    value={admin.role}
                    onChange={(e) => updateRole(admin._id, e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="head-admin">Head-Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteAdmin(admin._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeadAdminPanel;
