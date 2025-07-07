import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import axios from 'axios';

export default function Navbar() {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [prescriptionCount, setPrescriptionCount] = useState(0);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchPendingPrescriptions = async () => {
      if (userInfo?.role === 'admin') {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE}/api/orders/prescriptions`,
            {
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          setPrescriptionCount(res.data.length);
        } catch (err) {
          console.error('❌ Failed to fetch prescription count', err);
        }
      }
    };

    fetchPendingPrescriptions();
  }, [userInfo]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-700">🧪 MedStore</Link>

      <ul className="flex items-center gap-6">
        {userInfo && userInfo.role !== 'admin' && (
          <>
            <li>
              <Link to="/home" className="hover:underline text-gray-700">Home</Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="hover:underline text-gray-700 bg-blue-100 px-3 py-1 rounded-full"
              >
                🛒 Cart ({totalQuantity})
              </Link>
            </li>
            <li>
              <Link to="/upload-prescription" className="hover:underline text-blue-600 font-medium">
                📤 Upload Prescription
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:underline text-blue-600 font-medium">
                📜 My Orders
              </Link>
            </li>
            <li>
              <Link to="/track-orders" className="hover:underline text-blue-600 font-medium">
                🚚 Track Order
              </Link>
            </li>
            {/* <li>
              <Link to="/chatbot" className="hover:underline text-blue-600 font-medium">
                🤖 Chatbot
              </Link>
            </li> */}
          </>
        )}

        {userInfo && userInfo.role === 'admin' && (
          <>
            <li>
              <Link to="/admin-dashboard" className="hover:underline text-gray-700">
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="hover:underline text-gray-700">
                📦 Manage Orders
              </Link>
            </li>
            <li className="relative">
              <Link to="/admin/prescriptions" className="text-blue-700">
                📝 View Prescriptions
                {prescriptionCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {prescriptionCount}
                  </span>
                )}
              </Link>
            </li>
          </>
        )}

        {userInfo ? (
          <li>
            <button onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

