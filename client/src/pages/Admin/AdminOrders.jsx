import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE}/api/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(data);
    } catch (err) {
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeliver = async (orderId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE}/api/orders/${orderId}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Order marked as delivered");
      fetchOrders();
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">📋 All Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 italic">No orders placed yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 bg-white p-4 rounded shadow"
            >
              <p>
                <strong>User:</strong> {order.user?.name} ({order.user?.email})
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    order.status === "Confirmed"
                      ? "text-green-700"
                      : order.status === "Delivered"
                      ? "text-blue-700"
                      : "text-yellow-600"
                  }
                >
                  {order.status}
                </span>
              </p>
              <p>
                <strong>Payment:</strong> {order.paymentMethod}
              </p>

              {order.orderItems?.length > 0 && (
                <ul className="list-disc list-inside text-sm mt-2">
                  {order.orderItems.map((item, idx) => (
                    <li key={idx}>
                      {item.name || item.medicine?.name || "Medicine"} × {item.qty}
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-2 text-green-700 font-bold">
                Total: ₹{order.totalPrice.toFixed(2)}
              </p>

              {order.status === "Confirmed" && (
                <button
                  onClick={() => handleDeliver(order._id)}
                  className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
