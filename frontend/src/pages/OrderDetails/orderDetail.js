import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderById, updateOrderStatus } from "../../api.js";
import "./orderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    const { data } = await fetchOrderById(id);
    setOrder(data);
  };

  const changeStatus = async (status) => {
    await updateOrderStatus(id, status);
    loadOrder();
  };

  if (!order) return <p className="loading">Loading order details...</p>;

  return (
    <div className="order-detail-container">
      <button className="back-btn" onClick={() => navigate("/orders")}>
        ← Back to Orders
      </button>

      <h1 className="order-detail-title">Order #{order._id}</h1>

      <div className="order-detail-card">
        <h3>Customer Information</h3>
        <p><b>Name:</b> {order.customerName}</p>
        <p><b>Email:</b> {order.customerEmail}</p>
        <p><b>Phone:</b> {order.phone}</p>
        <p><b>Address:</b> {order.address}</p>
      </div>

      <div className="order-detail-card">
        <h3>Order Information</h3>
        <p><b>Status:</b> {order.status}</p>
        <p><b>Total:</b> ₹{order.totalAmount}</p>
        <p><b>Created:</b> {new Date(order.createdAt).toLocaleString()}</p>

        <div className="btn-group">
          <button className="btn btn-ship" onClick={() => changeStatus("Shipped")}>
            Mark as Shipped
          </button>
          <button className="btn btn-deliver" onClick={() => changeStatus("Delivered")}>
            Mark as Delivered
          </button>
        </div>
      </div>

      <div className="order-detail-card">
        <h3>Products</h3>
        <table className="order-products">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>₹{p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetail;
