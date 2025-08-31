import express from "express";
import crypto from "crypto";
import Admin from "../models/admin.model.js";   // ✅ import Admin model
import { sendAdminMail } from "../utils/sendMail.js"; // email utility

const router = express.Router(); // ✅ create new router

// ------------------ Forgot Password ------------------
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "No admin with this email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving (security best practice)
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save token + expiry (15 mins)
    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await admin.save();

    // Create reset URL with raw token (not hashed)
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    // Send reset email
    await sendAdminMail(
      email,
      admin.fullName,
      "Password Reset Request",
      `Click the link to reset your password: ${resetURL}`
    );

    res.json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------ Reset Password ------------------
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Hash the token from URL to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find admin by token & expiry
    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select("+password");

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set new password (hash handled in pre-save hook)
    admin.password = newPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
