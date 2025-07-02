import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Tesseract from "tesseract.js";
import PrescriptionViewer from "../../components/PrescriptionViewer";



export default function PrescriptionOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/orders/prescriptions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleImageClick = async (imagePath) => {
  const fullImageUrl = `${import.meta.env.VITE_API_BASE}${imagePath}`;
  setSelectedImage(fullImageUrl);
  setOcrText("Extracting...");

  try {
    const result = await Tesseract.recognize(fullImageUrl, "eng", {
      logger: (m) => console.log(m),
    });
    setOcrText(result.data.text);
  } catch (error) {
    console.error(error);
    setOcrText("Failed to extract text");
  }
};


  const confirmPrescription = async (orderId) => {
    const items = prompt("Enter JSON array of items: [{ medicineId, quantity, price }]");
    try {
      const parsed = JSON.parse(items);
      await axios.put(`/api/orders/confirm/${orderId}`, { items: parsed }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Order confirmed!");
      fetchOrders();
    } catch (err) {
      alert("Failed to confirm order");
    }
  };

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
  onClick={() => handleImageClick(order.prescriptionImage)}  // ✅ fix here
/>


              <p className="text-sm text-gray-600 mt-2">
                Uploaded on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => confirmPrescription(order._id)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirm Order
              </button>
            </div>
          ))}
        </div>
      )}

      {/* OCR Preview */}
     {selectedImage && <PrescriptionViewer imageUrl={selectedImage} ocrText={ocrText} />}

    </div>
  );
}
