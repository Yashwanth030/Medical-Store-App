// server/middleware/uploadMiddleware.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Set Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "medstore_uploads", // you can change the folder name if needed
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // optional optimization
  },
});

// ✅ Export Multer Upload Middleware
const upload = multer({ storage });

module.exports = upload;
