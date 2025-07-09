// server/routes/medicineRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");

// ✅ Upload New Medicine with Image (Cloudinary)
router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        description,
        brand,
        category,
        price,
        countInStock,
        requiresPrescription,
      } = req.body;

      const Medicine = require("../models/Medicine");

      const medicine = new Medicine({
        name,
        description,
        brand,
        category,
        price,
        countInStock,
        requiresPrescription,
        image: req.file?.path || null, // ✅ Cloudinary image URL
      });

      const saved = await medicine.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error("❌ Upload Error:", err.message);
      res.status(400).json({ message: err.message });
    }
  }
);

// ✅ Other CRUD Routes
router.get("/", getMedicines);
router.post("/", protect, adminOnly, upload.single("image"), createMedicine);
router.get("/:id", getMedicineById);
router.put("/:id", protect, adminOnly, upload.single("image"), updateMedicine);
router.delete("/:id", protect, adminOnly, deleteMedicine);

module.exports = router;
