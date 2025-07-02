// client/src/pages/Admin/AdminOrders.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function AdminOrders() {
  const { userInfo } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await axios.put(`/api/orders/${id}/confirm`, {}, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      alert("Order confirmed");
      fetchOrders();
    } catch (err) {
      alert("Confirm failed: " + err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">📦 All Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 italic">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow p-4 rounded border">
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Customer:</strong> {order.user?.name} ({order.user?.email})
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={order.status === "Confirmed" ? "text-green-600" : "text-yellow-600"}>
                  {order.status}
                </span>
              </p>
              <p>
                <strong>Payment:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.totalPrice}
              </p>

              {order.orderItems.length > 0 && (
                <ul className="list-disc list-inside mt-2">
                  {order.orderItems.map((item, i) => (
                    <li key={i}>
                      {item.name || item.medicine?.name} × {item.qty}
                    </li>
                  ))}
                </ul>
              )}

              {order.status !== "Confirmed" && (
                <button
                  onClick={() => handleConfirm(order._id)}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                >
                  Confirm & Dispatch
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
