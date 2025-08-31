import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./updateProduct.css";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    newprice: "",
    stock: "",
    images: [],
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();

        // Ensure images are objects with url + public_id
        const normalized = {
          ...data,
          images: data.images.map((img) =>
            typeof img === "string" ? { url: img, public_id: "" } : img
          ),
        };

        setForm(normalized);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Upload image to Cloudinary
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "your_unsigned_preset"); // replace with your preset

    try {
      setUploading(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        { method: "POST", body: data }
      );
      const uploaded = await res.json();

      const newImage = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };

      setForm({ ...form, images: [...form.images, newImage] });
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const removeImage = (index) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Only send clean data (ignore _id inside images)
      const payload = {
        ...form,
        images: form.images.map(({ url, public_id }) => ({
          url,
          public_id,
        })),
      };

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Product updated successfully!");
        navigate("/admin/products");
      } else {
        const errData = await res.json();
        alert("❌ Update failed: " + errData.error);
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  if (loading) return <p className="loading">Loading product...</p>;

  return (
    <div className="update-container">
      <h1>Update Product</h1>
      <form onSubmit={handleSubmit} className="update-form">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <label>Discounted Price (optional):</label>
        <input
          type="number"
          name="newprice"
          value={form.newprice}
          onChange={handleChange}
        />

        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <label>Images:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        {uploading && <p>Uploading...</p>}

        <div className="image-preview">
          {form.images.map((img, index) => (
            <div key={index} className="preview-item">
              <img
                src={typeof img === "string" ? img : img.url}
                alt="preview"
              />
              <button type="button" onClick={() => removeImage(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn save">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
