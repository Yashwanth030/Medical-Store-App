import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function UploadPrescription() {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // ✅ Default payment method

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a prescription image to upload.");

    try {
      setUploading(true);

      // 1. Upload image
      const formData = new FormData();
      formData.append("image", file); // ✅ Backend expects 'image' for Multer
      const uploadRes = await axios.post("/api/upload/prescription", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const filePath = uploadRes.data.filePath; // returned from upload route

      // 2. Submit the prescription order
      const orderRes = await axios.post("/api/orders", {
        orderItems: [],
        totalPrice: 0,
        paymentMethod,
        prescriptionImage: filePath,
      }, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      alert("Prescription uploaded and order created!");
      navigate("/orders");

    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded-lg">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Upload Prescription</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border border-gray-300 p-2 rounded"
        />

        {preview && (
          <img
            src={preview}
            alt="Prescription Preview"
            className="h-48 object-contain mx-auto rounded"
          />
        )}

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="UPI">UPI / QR Payment</option>
        </select>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Submit Prescription"}
        </button>
      </form>
    </div>
  );
}
