import React from "react";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome Admin 👑</h1>
      <p>You have full access to manage medicines, users, and more.</p>

      {/* Add links or buttons to admin actions here */}
      <div style={{ marginTop: "2rem" }}>
        <button style={{ margin: "0.5rem" }}>➕ Add Medicine</button>
        <button style={{ margin: "0.5rem" }}>📦 View Inventory</button>
        <button style={{ margin: "0.5rem" }}>👥 Manage Users</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
