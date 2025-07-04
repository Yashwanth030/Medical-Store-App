import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Tesseract from "tesseract.js";
import PrescriptionViewer from "../../components/PrescriptionViewer";

export default function PrescriptionOrders() {
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [items, setItems] = useState([{ medicineId: "", quantity: 1, price: 0 }]);
  const [showModal, setShowModal] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchOrders();
    fetchMedicines();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/orders/prescriptions", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setOrders(data);
    } catch {
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const { data } = await axios.get("/api/medicines");
      setMedicines(data);
    } catch {
      alert("Failed to fetch medicines");
    }
  };

  const handleImageClick = async (imagePath) => {
    const fullImageUrl = `${import.meta.env.VITE_API_BASE}${imagePath}`;
    setSelectedImage(fullImageUrl);
    setOcrText("Extracting...");
    try {
      const result = await Tesseract.recognize(fullImageUrl, "eng");
      setOcrText(result.data.text);
    } catch {
      setOcrText("Failed to extract text");
    }
  };

  const openConfirmModal = (orderId) => {
    setSelectedOrderId(orderId);
    setItems([{ medicineId: "", quantity: 1, price: 0 }]);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      const formatted = items.map((i) => ({
        medicineId: i.medicineId,
        quantity: Number(i.quantity),
        price: Number(i.price),
        name: medicines.find((m) => m._id === i.medicineId)?.name || "",
      }));

      await axios.put(`/api/orders/confirm/${selectedOrderId}`, { items: formatted }, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      alert("Order confirmed!");
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to confirm order");
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addRow = () => setItems([...items, { medicineId: "", quantity: 1, price: 0 }]);
  const removeRow = (index) => setItems(items.filter((_, i) => i !== index));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Prescription Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow bg-white">
              <h3 className="font-semibold text-gray-800 mb-2">{order.user.name}</h3>
              <img
                src={`${import.meta.env.VITE_API_BASE}${order.prescriptionImage}`}
                alt="Prescription"
                className="h-32 object-contain cursor-pointer"
                onClick={() => handleImageClick(order.prescriptionImage)}
              />
              <p className="text-sm text-gray-600 mt-2">
                Uploaded on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => openConfirmModal(order._id)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirm Order
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedImage && <PrescriptionViewer imageUrl={selectedImage} ocrText={ocrText} />}

      {/* ✅ Confirm Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Confirm Prescription</h3>
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <select
                  className="border p-2 w-1/2"
                  value={item.medicineId}
                  onChange={(e) => handleChange(idx, "medicineId", e.target.value)}
                >
                  <option value="">Select Medicine</option>
                  {medicines.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} (Stock: {m.countInStock})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="border p-2 w-1/4"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleChange(idx, "quantity", e.target.value)}
                />
                <input
                  type="number"
                  className="border p-2 w-1/4"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleChange(idx, "price", e.target.value)}
                />
                {items.length > 1 && (
                  <button
                    onClick={() => removeRow(idx)}
                    className="text-red-600 hover:underline"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <div className="flex justify-between mt-4">
              <button
                onClick={addRow}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                ➕ Add Item
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-1 bg-green-600 text-white rounded"
                >
                  ✅ Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
