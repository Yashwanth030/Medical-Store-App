import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Password reset successful. Please login again.");
        navigate("/login");
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("Something went wrong while resetting password.");
    }
  };

  const handleIdentifierChange = (value) => {
    if (value.includes("@")) {
      setEmail(value);
      setUsername("");
    } else {
      setUsername(value);
      setEmail("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">🔑 Forgot Password</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="text"
          placeholder="Enter email or username"
          value={email || username}
          onChange={(e) => handleIdentifierChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
