import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setOrders(data);
      } catch (err) {
        alert('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo.token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">📦 My Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 italic">No orders placed yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 p-4 rounded bg-white shadow"
            >
              <p className="text-sm text-gray-600">
                <strong>Order Date:</strong>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={
                    order.status === 'Confirmed'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }
                >
                  {order.status}
                </span>
              </p>
              <p>
                <strong>Payment:</strong> {order.paymentMethod}
              </p>
              {order.orderItems.length > 0 && (
                <div className="mt-3">
                  <strong>Items:</strong>
                  <ul className="list-disc list-inside text-sm">
                    {order.orderItems.map((item, idx) => (
                      <li key={idx}>
                        {item.name || item.medicine?.name || 'Medicine'} × {item.qty}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="mt-2 text-right font-semibold text-green-700">
                Total: ₹{order.totalPrice.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
