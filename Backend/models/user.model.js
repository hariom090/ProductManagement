import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[0-9]{10}$/, "Phone number must be 10 digits"], // ✅ Validation
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 6 
    },
      addresses: [
    {
      fullName: String,
      phone:{ type: String, match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],},
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    }
  ],
    refreshToken: {
        type: String
    }
}, { timestamps: true });

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.model("User", userSchema);
