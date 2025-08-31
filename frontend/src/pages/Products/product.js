import React, { useEffect, useState } from "react";
import "./product.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // Track per-product slider index

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);

        // Initialize index tracker for each product
        const initialIndexes = {};
        data.forEach((p) => {
          initialIndexes[p._id] = 0;
        });
        setCurrentImageIndex(initialIndexes);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Update Product
  const handleUpdate = (id) => {
    window.location.href = `/admin/products/update/${id}`;
  };

  // Slider Controls
  const handlePrev = (productId, total) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: (prev[productId] - 1 + total) % total,
    }));
  };

  const handleNext = (productId, total) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: (prev[productId] + 1) % total,
    }));
  };

  // Group products by category
  const grouped = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  if (loading) return <p className="loading">Loading products...</p>;

  return (
    <div className="products-container">
      <h1 className="title">Manage Products</h1>

      {Object.keys(grouped).map((category) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="product-grid">
            {grouped[category].map((product) => (
              <div key={product._id} className="product-card">
                {/* ✅ Image Slider */}
                <div className="slider-container">
                  {product.images.length > 0 && (
                    <>
                      <img
                        src={
                          product.images[currentImageIndex[product._id]]?.url
                        }
                        alt={product.name}
                        className="product-img"
                      />

                      {product.images.length > 1 && (
                        <>
                          <button
                            className="slider-btn prev"
                            onClick={() =>
                              handlePrev(product._id, product.images.length)
                            }
                          >
                            ❮
                          </button>
                          <button
                            className="slider-btn next"
                            onClick={() =>
                              handleNext(product._id, product.images.length)
                            }
                          >
                            ❯
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>

                <h3>{product.name}</h3>
                <p className="desc">{product.description}</p>
                <p className="price">
                  ₹{product.newprice ? product.newprice : product.price}
                </p>
                <div className="actions">
                  <button
                    onClick={() => handleUpdate(product._id)}
                    className="btn update"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
