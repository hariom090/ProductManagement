import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./adminPanel.css";

// ✅ MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddBoxIcon from "@mui/icons-material/AddBox";
import InventoryIcon from "@mui/icons-material/Inventory";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    navigate("/admin-login");
  };

  return (
    <div className="admin-panel">
      {/* ✅ Topbar */}
      <div className="topbar">
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          <MenuIcon />
        </button>
        <h2 className="panel-title">Admin Panel</h2>
      </div>

      {/* ✅ Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}` } onClick={() => setIsOpen(!isOpen)}>
        <ul>
          <li><Link to="/"><HomeIcon /> <span>Home</span></Link></li>
          <li><Link to="/admin/account"><AccountCircleIcon /> <span>Account</span></Link></li>
          <li><Link to="/admin/create-admin"><PersonAddIcon /> <span>Create Admin</span></Link></li>
          <li><Link to="/admin/add-products"><AddBoxIcon /> <span>Add Product</span></Link></li>
          <li><Link to="/admin/products"><InventoryIcon /> <span>Products</span></Link></li>
          <li><Link to="/admin/orders"><ListAltIcon /> <span>Orders</span></Link></li>
          <li><Link to="/admin/head-admin"><AdminPanelSettingsIcon /> <span>Manage Admin</span></Link></li>
          <li onClick={handleLogout}><LogoutIcon /> <span>Logout</span></li>
        </ul>
      </aside>

      {/* ✅ Main content */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
