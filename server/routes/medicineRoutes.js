const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  createMedicine,     // If this and addMedicine are different, keep both
  addMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");

const { protect, admin } = require("../middleware/authMiddleware");

// Route to create medicine with image upload
router.post(
  "/upload",
  protect,
  admin,
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

      const medicine = new (require("../models/Medicine"))({
        name,
        description,
        brand,
        category,
        price,
        countInStock,
        imageUrl: `/uploads/${req.file.filename}`,
        requiresPrescription,
      });

      const saved = await medicine.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.get("/", getMedicines);
router.post("/add", protect, admin, addMedicine);  // Or use createMedicine if needed
router.post("/", protect, admin, createMedicine);  // You can remove one of these if redundant
router.get("/:id", getMedicineById);
router.put("/:id", protect, admin, updateMedicine);
router.delete("/:id", protect, admin, deleteMedicine);

module.exports = router;
