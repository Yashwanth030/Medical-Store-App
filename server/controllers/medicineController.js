const Medicine = require("../models/Medicine");

// ✅ CREATE MEDICINE — with optional image upload
const createMedicine = async (req, res) => {
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

    const imagePath = req.file ? `/uploads/${req.file.filename}` : medicine.image || null;


    const medicine = new Medicine({
      name,
      description,
      brand,
      category,
      price,
      countInStock,
      requiresPrescription,
      image: imagePath, // ✅ Ensure your Mongoose model has `image`
    });

    const savedMedicine = await medicine.save();
    res.status(201).json(savedMedicine);
  } catch (err) {
    console.error("❌ Failed to create medicine:", err.message);
    res.status(500).json({
      message: "Failed to add medicine",
      error: err.message,
    });
  }
};

// ✅ GET ALL MEDICINES
const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET MEDICINE BY ID
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (medicine) {
      res.json(medicine);
    } else {
      res.status(404).json({ message: "Medicine not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE MEDICINE
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // ✅ Update fields individually
    medicine.name = req.body.name || medicine.name;
    medicine.description = req.body.description || medicine.description;
    medicine.price = req.body.price || medicine.price;
    medicine.countInStock = req.body.countInStock || medicine.countInStock;
    medicine.requiresPrescription = req.body.requiresPrescription || medicine.requiresPrescription;

    // ✅ Update image if new image is uploaded
    if (req.file) {
      medicine.image = `/uploads/${req.file.filename}`;
    }

    const updated = await medicine.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ DELETE MEDICINE
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    await Medicine.findByIdAndDelete(req.params.id); // ✅ SAFER DELETE

    res.json({ message: "Medicine deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Failed to delete medicine", error: err.message });
  }
};


// ✅ EXPORT ALL CONTROLLERS
module.exports = {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};
