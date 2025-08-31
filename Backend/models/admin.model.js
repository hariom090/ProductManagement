// models/Admin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["head-admin", "admin"], default: "admin" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// Hash password before save
adminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
adminSchema.methods.isPasswordCorrect = function(password) {
  return bcrypt.compare(password, this.password);
};

// Generate JWT token
adminSchema.methods.generateToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
