import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';

export default function HomePage() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/medicines');
        setMedicines(res.data);
      } catch (err) {
        console.error('Failed to fetch medicines:', err.message);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (med) => {
    dispatch(addToCart(med));
    alert(`${med.name} added to cart`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Available Medicines</h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {medicines.map((med) => (
          <div
            key={med._id}
            className="border rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition"
          >
            {med.image ? (
              <img
                src={`${import.meta.env.VITE_API_BASE}${med.image}`}
                alt={med.name}
                className="h-32 w-full object-cover rounded-md mb-3"
              />
            ) : (
              <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                No Image
              </div>
            )}

            <h3 className="text-lg font-semibold text-gray-800">{med.name}</h3>
            <p className="text-sm text-gray-500">{med.description}</p>
            <p className="font-bold text-green-600 mt-2">₹{med.price}</p>

            {/* ✅ Show stock status */}
            <p className={`text-sm mt-1 font-semibold ${med.countInStock === 0 ? 'text-red-600' : 'text-green-600'}`}>
              {med.countInStock === 0 ? 'Out of Stock' : `In Stock: ${med.countInStock}`}
            </p>

            {/* ✅ Conditional Button */}
            {med.countInStock === 0 ? (
  <button
    disabled
    className="mt-3 w-full bg-red-500 text-white py-1 rounded cursor-not-allowed"
  >
    Out of Stock
  </button>
) : (
  <button
    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded"
    onClick={() => handleAddToCart(med)}
  >
    Add to Cart
  </button>
)}

          </div>
        ))}
      </div>

      {medicines.length === 0 && (
        <p className="text-center text-gray-500 italic mt-10">No medicines available.</p>
      )}
    </div>
  );
}
