// routes/admin.routes.js
import express from "express";
import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { sendAdminMail } from "../utils/sendMail.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Verify JWT helper
const verifyToken = async (req) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// ======================= EXISTING ROUTES =======================

// Change password
router.post("/change-password", async (req, res) => {
  try {
    const decoded = await verifyToken(req);
    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(decoded.id).select("+password");

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Error in change-password:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get logged-in admin details
router.get("/me", async (req, res) => {
  try {
    const decoded = await verifyToken(req);
    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Admin or Head Admin
router.post("/create", async (req, res) => {
  try {
    const decoded = await verifyToken(req);
    if (!decoded || decoded.role !== "head-admin") {
      return res.status(403).json({ message: "Only head admins can create accounts" });
    }

    const { email, fullName, role } = req.body;

    if (role === "head-admin") {
      const headAdmins = await Admin.countDocuments({ role: "head-admin" });
      if (headAdmins >= 4) {
        return res.status(400).json({ message: "Only 4 head admins allowed" });
      }
    }

    const password = Math.random().toString(36).slice(-8);

    const newAdmin = new Admin({
      email,
      fullName,
      role,
      password,
      createdBy: decoded.id,
    });
    await newAdmin.save();

    await sendAdminMail(email, fullName, role, password);

    res.json({ message: `${role} created and email sent.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await admin.isPasswordCorrect(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = admin.generateToken();
    res.json({ token, role: admin.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove Admin
router.delete("/remove/:id", async (req, res) => {
  try {
    const decoded = await verifyToken(req);
    if (!decoded || decoded.role !== "head-admin") {
      return res.status(403).json({ message: "Only head admins can remove accounts" });
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================= NEW ROUTES =======================

// Get all admins (for head-admin)
router.get("/all", async (req, res) => {
  try {
    const decoded = await verifyToken(req);
    if (!decoded || decoded.role !== "head-admin") {
      return res.status(403).json({ message: "Only head admins can view admins" });
    }

    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update admin role
router.put("/update-role/:id", async (req, res) => {
  try {
    const decoded = await verifyToken(req);
    if (!decoded || decoded.role !== "head-admin") {
      return res.status(403).json({ message: "Only head admins can update roles" });
    }

    const { role } = req.body;
    if (!role) return res.status(400).json({ message: "Role is required" });

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedAdmin) return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Role updated successfully", admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
