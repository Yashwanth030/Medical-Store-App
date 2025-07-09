import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OrderDetails() {
  const { id } = useParams(); // order ID from URL
  const [order, setOrder] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        const selected = data.find((o) => o._id === id);
        setOrder(selected);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch order details");
      }
    };

    fetchOrder();
  }, [id, userInfo.token]);

  if (!order) return <p className="p-6">Loading order details...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">🧾 Order Summary</h2>

      <p><strong>Order ID:</strong> {order._id}</p>
      <p>
        <strong>Status:</strong>{" "}
        <span
          className={
            order.status === "Confirmed"
              ? "text-green-600"
              : order.status === "Delivered"
              ? "text-blue-600"
              : "text-yellow-600"
          }
        >
          {order.status}
        </span>
      </p>
      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      <p><strong>Address:</strong> {order.shippingAddress || "N/A"}</p>

      <div className="mt-4">
        <h3 className="font-bold">Items:</h3>
        <ul className="list-disc list-inside">
          {order.orderItems.map((item, idx) => (
            <li key={idx}>
              {(item.name || item.medicine?.name || "Unknown Item")} × {item.qty || item.quantity} — ₹
              {item.price}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 font-bold text-green-700">
        Total Price: ₹{order.totalPrice?.toFixed(2)}
      </p>

      {order.prescriptionImage && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Prescription:</h3>
          <img
            src={order.prescriptionImage}
            alt="Prescription"
            className="h-48 object-contain rounded border"
          />
        </div>
      )}
    </div>
  );
}
