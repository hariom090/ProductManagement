import express from "express";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import userModel from "../models/user.model.js";

const router = express.Router();


// router.post("/create", async (req, res) => {
//   try {
//     const { customerName, customerEmail, address, phone, products, totalAmount } = req.body;

//     // Check stock for each product
//     for (let item of products) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ message: `Product ${item.productId} not found` });
//       }
//       if (product.stock < item.quantity) {
//         return res.status(400).json({ message: `Not enough stock for ${product.name}` });
//       }
//     }

//     // Reduce stock
//     for (let item of products) {
//       await Product.findByIdAndUpdate(item.productId, {
//         $inc: { stock: -item.quantity },
//       });
//     }

//     // ✅ Map products → items
//     const items = products.map((p) => ({
//       product: p.productId,
//       quantity: p.quantity,
//       price: p.price,
//     }));

//     // Save order
//     const newOrder = new Order({
//       user: req.user?._id || null, // if logged in
//       items,
//       shippingAddress: address,
//       totalAmount,
//       status: "Pending",
//     });

//     await newOrder.save();

//     res.status(201).json({ message: "Order placed successfully", newOrder });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });





// ✅ Get All Orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name")    // only product names
      .populate("user", "email")          // only user email
                // only user email

const formattedOrders = orders.map((order) => {


  return {
    _id: order._id,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items,
    // ✅ Customer info comes from shippingAddress
    userId: order.user?._id,

    customerName: order.shippingAddress?.fullName || "N/A",
    customerEmail: order.user?.email || order.shippingAddress?.email || "N/A",
    phone: order.shippingAddress?.phone || "N/A",
    address: order.shippingAddress
      ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.pincode}, ${order.shippingAddress.country}`
      : "N/A",
  };
});


    res.json(formattedOrders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err.message);
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});






// ✅ Get Single Order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Update Order Status (Admin)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("items.product", "name price");

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order status updated", updatedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Delete Order (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
