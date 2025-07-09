import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form))
      .unwrap()
      .then((res) => {
        // ✅ Role-based redirection
        if (res.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          alert("Registration successful. Please login.");
          navigate('/login');
        }
      })
      .catch(() => {});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-indigo-200">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Register</h2>

        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-all"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
