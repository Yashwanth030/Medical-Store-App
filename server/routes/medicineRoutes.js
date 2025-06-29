const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Upload route (Admin only)
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
        imageUrl: `/uploads/${req.file.filename}`,
      });

      const saved = await medicine.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// ✅ Other CRUD routes
router.get("/", getMedicines);
router.post("/", protect, adminOnly, createMedicine); // Create without image
router.get("/:id", getMedicineById);
router.put("/:id", protect, adminOnly, updateMedicine);
router.delete("/:id", protect, adminOnly, deleteMedicine);

module.exports = router;
