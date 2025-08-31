import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if different
});

// Products
export const fetchProducts = () => API.get("/products");
export const addProduct = (data) => API.post("/products/add", data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Orders
export const fetchOrders = () => API.get("/orders");
export const fetchOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) =>  API.put(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

export default API;
