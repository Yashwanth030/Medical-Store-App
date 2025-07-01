import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Components and Pages
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminDashboard from "./pages/AdminDashboard";
import Chatbot from "./components/Chatbot";
import HomePage from "./pages/HomePage";
import ChatbotWidget from "./components/ChatbotWidget";
import CartPage from "./pages/CartPage";
import UploadPrescription from "./pages/UploadPrescription";
import PrescriptionOrders from './pages/Admin/PrescriptionOrders';
import Orders from "./pages/Orders";



function App() {
  // ✅ Grab user info from Redux auth state
  const user = useSelector((state) => state.auth.userInfo);

  // ✅ Route protection logic
  const PrivateRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar displayed on all pages */}
      <Navbar />

      {/* Main Routing Area */}
      <main className="pt-16 px-4">
        <Routes>
          {/* ✅ Redirect based on login and role */}
          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin-dashboard" />
                ) : (
                  <Navigate to="/home" />
                )
              ) : (
                <LoginPage />
              )
            }
          />

          {/* ✅ Public pages if not logged in */}
          {!user && (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </>
          )}

          {/* ✅ Admin-only dashboard */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* ✅ Customer/User homepage */}
          <Route
            path="/home"
            element={
              <PrivateRoute allowedRoles={["admin", "customer", "user"]}>
                <HomePage />
              </PrivateRoute>
            }
          />

          {/* ✅ Cart page for customers/users */}
          <Route
            path="/cart"
            element={
              <PrivateRoute allowedRoles={["customer", "user", "admin"]}>
                <CartPage />
              </PrivateRoute>
            }
          />

          {/* ✅ Optional Chatbot route (if used as page) */}
          {/* <Route
            path="/chatbot"
            element={
              <PrivateRoute allowedRoles={["customer", "user"]}>
                <Chatbot />
              </PrivateRoute>
            }
          /> */}
<Route path="/upload-prescription"
  element={<PrivateRoute allowedRoles={["customer", "user"]}>
      <UploadPrescription />
    </PrivateRoute>}/>
    <Route
  path="/admin/prescriptions"
  element={
    <PrivateRoute allowedRoles={["admin"]}>
      <PrescriptionOrders />
    </PrivateRoute>
  }
/>

<Route
  path="/orders"
  element={
    <PrivateRoute allowedRoles={["customer", "user"]}>
      <Orders />
    </PrivateRoute>
  }
/>

          {/* ✅ Fallback: redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* ✅ Chatbot widget visible only to customers */}
      {user && user.role !== "admin" && <ChatbotWidget />}
    </div>
  );
}

export default App;
