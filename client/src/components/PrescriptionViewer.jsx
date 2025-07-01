import React from "react";

export default function PrescriptionViewer({ imageUrl, ocrText }) {
  return (
    <div className="bg-gray-100 p-4 rounded">
      <h4 className="text-lg font-semibold mb-2">OCR Text Preview</h4>
      <img
        src={imageUrl}
        alt="Prescription"
        className="w-full max-h-64 object-contain rounded mb-4"
      />
      <pre className="whitespace-pre-wrap text-sm text-gray-800 border p-2 bg-white rounded">
        {ocrText || "No text extracted."}
      </pre>
    </div>
  );
}