const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");

// ✅ Multer disk storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Upload prescription image route (used by users)
router.post("/prescription", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;
    res.json({ filePath }); // this gets saved in prescriptionImage
  } catch (err) {
    console.error("❌ Upload Error:", err.message);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

module.exports = router;
