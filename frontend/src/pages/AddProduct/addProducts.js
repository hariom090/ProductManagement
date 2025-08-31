import React, { useState } from "react";
import "./addProduct.css";

const AddProducts = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Earings", "Neck Chain", "Finger Rings", "Hair Clips", "Bracelets",
    "Watches", "Broches", "Sling Bags", "Wedding Bags", "Clutch",
    "Wallets", "Necklace", "Kada", "Belts"
  ];

  const allTags = [ 'hot' , 'sale', 'offer', 'new' , 'trendy'];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags:"",
    category: "",
    price: "",
    stock: "",
    newprice: "",
  });

  // handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]); // store File objects
  };

  // remove an image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // append images
    images.forEach((img) => {
      data.append("images", img);
    });

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/products/add", {
        method: "POST",
        body: data, // FormData sends headers automatically
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ Product added successfully!");
        console.log("Saved Product:", result);

        // reset form
        setFormData({
          name: "",
          description: "",
           tags:"",
          category: "",
          price: "",
          stock: "",
          newprice: "",
        });
        setImages([]);
      } else {
        alert("❌ Error: " + (result.error || "Something went wrong!"));
      }
    } catch (err) {
      console.error("Error saving product:", err);
      alert("⚠️ Something went wrong! Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-container">
      <h1 className="product-title">Add New Product</h1>

      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          required
        ></textarea>

         <select
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          required
        >
          <option value="">Select Tag</option>
          {allTags.map((tag, idx) => (
            <option key={idx} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="newprice"
          placeholder="Discounted Price"
          value={formData.newprice}
          onChange={handleChange}
        />

        <div className="image-upload-box">
          <label>Upload Images</label>
          <input type="file" multiple onChange={handleFileChange} accept="image/*" />
        </div>

        <div className="image-preview">
          {images.map((img, index) => (
            <div key={index} className="image-item">
              <img src={URL.createObjectURL(img)} alt="preview" />
              <button type="button" onClick={() => removeImage(index)}>✖</button>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
