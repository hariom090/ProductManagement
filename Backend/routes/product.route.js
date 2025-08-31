import express from "express";
import Product from "../models/product.model.js";
import { cloudinary,upload } from "../config/cloudinary.config.js";

const router = express.Router();

/* ----------------- ADD NEW PRODUCT ----------------- */
router.post("/add", upload.array("images", 5), async (req, res) => {
  try {
    const { name, description,tags, price, newprice, category, stock } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const imageData = req.files.map((file) => ({
      url: file.path, // cloudinary secure_url
      public_id: file.filename, // cloudinary public id
    }));

    const newProduct = new Product({
      name,
      description,
      tags,
      price,
      newprice,
      category,
      stock,
      images: imageData,
    });

    await newProduct.save();
    res.status(201).json({ message: "✅ Product added successfully", product: newProduct });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ error: err.message });
  }
});



/* ----------------- UPDATE PRODUCT ----------------- */
router.put("/:id", async (req, res) => {
  try {
    const { name, description,tags, price, newprice, category, stock, images } = req.body;

    let updateData = { name, description,tags, price, newprice, category, stock };

    // If frontend sends image URLs (Cloudinary)
    if (images && images.length > 0) {
      updateData.images = images.map((img) =>
        typeof img === "string" ? { url: img } : img
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "✅ Product updated successfully", updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ----------------- GET ALL PRODUCTS ----------------- */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------- GET SINGLE PRODUCT ----------------- */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Safely remove images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (let img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err); // Logs full error for debugging
    res.status(500).json({ error: err.message });
  }
});


export default router;
