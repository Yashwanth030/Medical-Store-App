import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function TrackOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setOrders(data);
      } catch (err) {
        alert("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo.token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">📦 Track My Orders</h2>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 italic">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 bg-white p-4 rounded shadow"
            >
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    order.status === "Delivered"
                      ? "text-green-700"
                      : order.status === "Confirmed"
                      ? "text-yellow-700"
                      : "text-gray-500"
                  }
                >
                  {order.status}
                </span>
              </p>
              <p>
                <strong>Delivery Address:</strong> {order.shippingAddress}
              </p>
              <p>
                <strong>Payment:</strong> {order.paymentMethod}
              </p>

              {order.orderItems?.length > 0 && (
                <>
                  <p className="mt-2 font-semibold">Items Ordered:</p>
                  <ul className="list-disc list-inside text-sm">
                    {order.orderItems.map((item, idx) => (
                      <li key={idx}>
                        {item.name || item.medicine?.name || "Medicine"} × {item.qty}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <p className="mt-2 font-bold text-green-700">
                Total: ₹{order.totalPrice.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
