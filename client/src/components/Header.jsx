import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-blue-700 text-white shadow-md py-3 px-6 flex justify-between items-center">
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate('/')}
      >
        💊 MedStore ERP
      </div>

      <div className="flex items-center space-x-6">
        {userInfo && (
          <p className="text-sm">
            Hello, <span className="font-semibold">{userInfo.isAdmin ? 'Admin' : userInfo.name}</span>
          </p>
        )}

        {userInfo ? (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-200 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-200 transition"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
