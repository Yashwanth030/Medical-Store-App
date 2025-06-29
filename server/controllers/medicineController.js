const Medicine = require("../models/Medicine");

const createMedicine = async (req, res) => {
  try{const {
    name,
    description,
    brand,
    category,
    price,
    countInStock,
    imageUrl,
    requiresPrescription,
  } = req.body;

  const medicine = new Medicine({
    name,
    description,
    brand,
    category,
    price,
    countInStock,
    imageUrl,
    requiresPrescription,
  });

   const savedMedicine = await medicine.save();
    res.status(201).json(savedMedicine);
  } catch (err) {
    res.status(500).json({ message: "Failed to add medicine", error: err.message });
  }
};

const getMedicines = async (req, res) => {
  const medicines = await Medicine.find();
  res.json(medicines);
};

// const addMedicine = async (req, res) => {
//   try {
//     const medicine = new Medicine(req.body);
//     const saved = await medicine.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };
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
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
      Object.assign(medicine, req.body);
      const updated = await medicine.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: "Medicine not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
      await medicine.remove();
      res.json({ message: "Medicine deleted successfully" });
    } else {
      res.status(404).json({ message: "Medicine not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/medicineController.js
module.exports = {
  createMedicine,
  getMedicines,
  // addMedicine,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};

