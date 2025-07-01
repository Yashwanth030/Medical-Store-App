const Order = require("../models/Order");
const Medicine = require("../models/Medicine");

// @desc    Create order (with or without prescription)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, paymentMethod, prescriptionImage } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method required" });
    }

    if (!orderItems?.length && !prescriptionImage) {
      return res.status(400).json({ message: "Order must have items or prescription" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems: orderItems || [],
      totalPrice: totalPrice || 0,
      paymentMethod,
      prescriptionImage,
      status: prescriptionImage ? "Prescription Uploaded" : "Pending",
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed", error: err.message });
  }
};


// @desc    Admin confirms direct order and reduces stock
// @route   PUT /api/orders/:id/confirm
// @access  Admin
const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("orderItems.medicine");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Confirmed") {
      return res.status(400).json({ message: "Order already confirmed" });
    }

    for (const item of order.orderItems) {
      const med = await Medicine.findById(item.medicine._id);
      if (med.countInStock < item.qty) {
        return res.status(400).json({ message: `${med.name} is out of stock` });
      }
      med.countInStock -= item.qty;
      await med.save();
    }

    order.status = "Confirmed";
    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();

    res.json({ message: "Order confirmed & stock updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Admin confirms prescription order and reduces stock
// @route   PUT /api/orders/confirm/:id
// @access  Admin
const confirmPrescriptionOrder = async (req, res) => {
  try {
    const { items } = req.body; // [{ medicineId, quantity, price }]
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Set order items & total
    order.orderItems = items;
    order.totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    order.status = "Confirmed";
    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();

    // Reduce stock
    for (let item of items) {
      const med = await Medicine.findById(item.medicineId);
      if (med.countInStock < item.quantity) {
        return res.status(400).json({ message: `${med.name} is out of stock` });
      }
      med.countInStock -= item.quantity;
      await med.save();
    }

    res.json({ message: "Prescription order confirmed and stock updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get orders for logged-in user
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Admin: Get all orders (with optional date filter)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const orders = await Order.find(filter).populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Admin: Get all prescription-uploaded orders
// @route   GET /api/orders/prescriptions
// @access  Admin
const getPendingPrescriptions = async (req, res) => {
  try {
    const orders = await Order.find({
      prescriptionImage: { $ne: null },
      status: "Prescription Uploaded",
    }).populate("user", "name email");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch prescription orders" });
  }
};

module.exports = {
  createOrder,
  confirmOrder,
  confirmPrescriptionOrder,
  getMyOrders,
  getAllOrders,
  getPendingPrescriptions,
};
