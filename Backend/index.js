import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/product.route.js";
//import userRoutes from "./Routes/user.routes.js"; // you already have this
import adminRoutes from './routes/admin.route.js'

import orderRoutes from "./routes/order.route.js";

import passwordRoutes from "./routes/forgotOrResetPassword.route.js";



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/admin", passwordRoutes);

//app.use("/api/users", userRoutes);

// DB + Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));
