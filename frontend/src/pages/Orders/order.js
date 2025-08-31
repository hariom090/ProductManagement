import React, { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus, deleteOrder } from "../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import "./order.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await fetchOrders();
    setOrders(data);
  };

  const toggleExpand = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const changeStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    loadOrders();
  };

  // 🗑 Delete  function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(id);
      loadOrders(); // refresh after delete
    }
  };

  const allStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="orders-container">
      <h1 className="orders-title">Manage Orders</h1>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Products</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <React.Fragment key={o._id}>
                <tr className="order-row" onClick={() => toggleExpand(o._id)}>
                  <td data-label="Customer">{o.customerName}</td>
                  <td data-label="Products">
                    {o.items && o.items.length > 0
                      ? o.items.map((p) => p.product?.name).join(", ")
                      : "No products"}
                  </td>
                  <td data-label="Status">{o.status}</td>
                  <td data-label="Actions" className="actions">
                    {/* 🔽 Status Dropdown */}
                    <select
                      className="status-select"
                      value=""
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => changeStatus(o._id, e.target.value)}
                    >
                      <option value="" disabled>
                        Change Status
                      </option>
                      {allStatuses
                        .filter((s) => s !== o.status)
                        .map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                    </select>

                    {/* 🗑 Delete Address Button */}
                    <button
                      className="btn btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(o._id);
                      }}
                    >
                      <span className="hide-on-mobile">Delete Order</span>
                      <span className="show-on-mobile">
                        <DeleteIcon fontSize="small" />
                      </span>
                    </button>

                  </td>
                </tr>


                {expandedOrder === o._id && (
                  <tr className="order-details-row">
                    <td colSpan="4">
                      <div className="order-details">
                        <h3>Order Details</h3>
                        <p>
                          <b>ID:</b> {o._id}
                        </p>
                        <p>
                          <b>UserID:</b> {o.userId}
                        </p>
                        <p>
                          <b>Customer:</b> {o.customerName}
                        </p>
                        <p>
                          <b>Email:</b> {o.customerEmail}
                        </p>
                        <p>
                          <b>Phone:</b> {o.phone}
                        </p>
                        <p>
                          <b>Address:</b> {o.address}
                        </p>
                        <p>
                          <b>Status:</b> {o.status}
                        </p>
                        <p>
                          <b>Total:</b> ₹{o.totalAmount}
                        </p>
                        <p>
                          <b>Created:</b>{" "}
                          {new Date(o.createdAt).toLocaleString()}
                        </p>

                        <h4>Products</h4>
                        <ul>
                          {o.items && o.items.length > 0 ? (
                            o.items.map((p) => (
                              <li key={p._id}>
                                {p.product?.name} × {p.quantity} – ₹{p.price}
                              </li>
                            ))
                          ) : (
                            <li>No products found</li>
                          )}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
