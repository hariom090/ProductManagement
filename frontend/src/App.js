import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/home.js";
import AdminPanel from "./pages/AdminPanel/adminPanel.js";
import AddProducts from "./pages/AddProduct/addProducts.js";
import Orders from "./pages/Orders/order.js";
import OrderDetail from "./pages/OrderDetails/orderDetail.js";
import Products from "./pages/Products/product.js";
import UpdateProduct from "./pages/Products/UpdateProduct/updateProduct.js";
import AdminLogin from "./pages/AdminLogin/adminLogin.js";
import CreateAdmin from "./pages/AdminCreate/admincreate.js";
import AdminChangePassword from "./pages/ChangePassword/changePassword.js";
import AccountPage from "./pages/Account/account.js";
import ForgotPassword from "./pages/ForgotPassword/forgotPassword.js";
import ResetPassword from "./pages/ResetPassword/resetPassword.js";
import HeadAdminPanel from "./pages/HeadAdminPanel/headAdminPanel.js";

// Simple auth check example
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken"); // get admin token
  return token ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PrivateRoute>
          <Home />
        </PrivateRoute>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />


        {/* Protected Admin Panel Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        >
          <Route path="create-admin" element={
            <CreateAdmin />
          } />
          <Route index element={<Products />} /> {/* Default = Products */}
          <Route path="products" element={<Products />} />
          <Route path="change-password" element={<AdminChangePassword />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="products/update/:id" element={<UpdateProduct />} />
          <Route path="add-products" element={<AddProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="head-admin" element={<HeadAdminPanel />} />
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<h2>404 Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
