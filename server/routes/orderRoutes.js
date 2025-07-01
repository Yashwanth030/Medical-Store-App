const express = require("express");
const router = express.Router();

const {
  createOrder,
  confirmOrder,
  getMyOrders,
  getAllOrders,
  confirmPrescriptionOrder,
  getPendingPrescriptions,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// ✅ Create new order (customer)
router.post("/", protect, createOrder);

// ✅ Get logged-in customer's orders
router.get("/myorders", protect, getMyOrders);

// ✅ Admin gets all orders (with optional date filter)
router.get("/", protect, adminOnly, getAllOrders);

// ✅ Admin confirms a direct cart order (non-prescription)
router.put("/:id/confirm", protect, adminOnly, confirmOrder);

// ✅ Admin: Get all pending prescription uploads
router.get("/prescriptions", protect, adminOnly, getPendingPrescriptions);

// ✅ Admin confirms prescription upload manually
router.put("/confirm/:id", protect, adminOnly, confirmPrescriptionOrder);

module.exports = router;
