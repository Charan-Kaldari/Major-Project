import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMenu from "./pages/admin/MenuManagement";
import AdminOrders from "./pages/admin/OrderManagement";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Navbar />
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/menu"      element={<Menu />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />

            <Route path="/cart"   element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin"              element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/menu"         element={<ProtectedRoute adminOnly><AdminMenu /></ProtectedRoute>} />
            <Route path="/admin/orders"       element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
