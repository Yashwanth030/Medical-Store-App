// server/routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.post("/prescription", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({ filePath: req.file.path }); // ✅ Cloudinary URL
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

module.exports = router;
