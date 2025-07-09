// server/routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

// ✅ Upload Prescription (Cloudinary)
router.post("/prescription", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Return Cloudinary file path
    res.status(200).json({ filePath: req.file.path });
  } catch (err) {
    console.error("❌ Prescription Upload Error:", err.message);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

module.exports = router;
