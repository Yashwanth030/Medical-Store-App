import React from "react";

export default function PrescriptionViewer({ imageUrl, ocrText }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Prescription Preview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <img
            src={imageUrl}
            alt="Prescription"
            className="max-h-[400px] object-contain w-full border"
          />

          {/* OCR Text */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Extracted Text (OCR):</h3>
            <div className="p-3 border rounded bg-gray-50 text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
              {ocrText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
