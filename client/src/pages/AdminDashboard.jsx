import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    countInStock: '',
    image: null,
  });

  const fetchMedicines = async () => {
    try {
      const res = await axios.get('/api/medicines');
      setMedicines(res.data);
    } catch (err) {
      console.error('Error fetching medicines:', err.message);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/medicines/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchMedicines();
      } catch (err) {
        console.error('Failed to delete medicine:', err.message);
        alert('Failed to delete medicine.');
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('countInStock', form.countInStock);
      if (form.image) {
        formData.append('image', form.image);
      }

      const token = localStorage.getItem('token');

      await axios.post('/api/medicines', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        name: '',
        description: '',
        price: '',
        countInStock: '',
        image: null,
      });

      fetchMedicines();
    } catch (error) {
      console.error('Add medicine failed:', error.response?.data || error.message);
      alert('Failed to add medicine. Check console for details.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Admin Dashboard</h2>

      {/* Add New Medicine Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow"
      >
        <input
          type="text"
          name="name"
          placeholder="Medicine Name"
          className="border p-2 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="border p-2 rounded"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          className="border p-2 rounded"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="countInStock"
          placeholder="Stock Count"
          className="border p-2 rounded"
          value={form.countInStock}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          className="border p-2 rounded"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded col-span-full"
        >
          Add Medicine
        </button>
      </form>

      {/* Medicines Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white shadow rounded">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price (₹)</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => (
              <tr key={med._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {med.image ? (
                    <img
                      src={med.image}
                      alt={med.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No Image</span>
                  )}
                </td>
                <td className="p-3">{med.name}</td>
                <td className="p-3 font-semibold text-green-700">₹{med.price}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(med._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {medicines.length === 0 && (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500 italic">
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
