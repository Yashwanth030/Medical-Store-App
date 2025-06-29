import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminDashboard from "./pages/AdminDashboard";
import Chatbot from "./components/Chatbot";
import HomePage from "./pages/HomePage"; // ✅ Import HomePage

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<LoginPage />} /> {/* Fallback */}
      </Routes>
    </>
  );
}

export default App;
