import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
              <Link
                to="/upload-prescription"
                className="hover:underline text-blue-600 font-medium"
              >
                📤 Upload Prescription
              </Link>
            </li>
            <li>
  <Link
    to="/orders"
    className="hover:underline text-blue-600 font-medium"
  >
    📜 My Orders
  </Link>
</li>

          </>
        )}

        {userInfo && userInfo.role === 'admin' && (
          <>
            <li>
              <Link to="/admin-dashboard" className="hover:underline text-gray-700">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/prescriptions" className="hover:underline text-blue-700">
                📝 View Prescriptions
              </Link>
            </li>
          </>
        )}

        {userInfo ? (
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
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
