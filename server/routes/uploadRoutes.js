const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

// POST /api/upload/prescription
router.post("/prescription", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;
    res.json({ filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});


module.exports = router;
