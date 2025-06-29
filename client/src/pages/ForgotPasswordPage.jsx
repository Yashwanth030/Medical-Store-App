import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password reset successful. Please login again.");
        navigate("/login");
      } else {
        alert(data.message || "Failed to reset password");
      }
    } catch (err) {
      alert("Error while resetting password");
    }
  };

  return (
    <form onSubmit={handleReset}>
      <h2>Forgot Password</h2>
      <input
        type="text"
        placeholder="Enter email or username"
        value={email || username}
        onChange={(e) => {
          if (e.target.value.includes("@")) {
            setEmail(e.target.value);
            setUsername("");
          } else {
            setUsername(e.target.value);
            setEmail("");
          }
        }}
        required
      />
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}

export default ForgotPasswordPage;
