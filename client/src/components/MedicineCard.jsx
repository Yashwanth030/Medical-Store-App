import React from "react";

export default function MedicineCard({ med, handleAddToCart }) {
  return (
    <div className="border rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition">
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

      {med.countInStock === 0 ? (
        <button
          disabled
          className="mt-3 w-full bg-red-400 text-white py-1 rounded cursor-not-allowed"
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
  );
}
