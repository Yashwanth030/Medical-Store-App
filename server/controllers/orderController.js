const Order = require("../models/Order");
const Medicine = require("../models/Medicine");

// ✅ Create Order (with or without prescription)
const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, paymentMethod, prescriptionImage, shippingAddress } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method required" });
    }

    if (!orderItems?.length && !prescriptionImage) {
      return res.status(400).json({ message: "Order must have items or prescription" });
    }

    // ✅ If it's a cart-based order, reduce stock immediately
    if (!prescriptionImage && orderItems?.length > 0) {
      for (const item of orderItems) {
        const med = await Medicine.findById(item.medicine);
        if (!med) {
          return res.status(404).json({ message: "Medicine not found" });
        }
        if (med.countInStock < item.qty) {
          return res.status(400).json({
            message: `${med.name} has only ${med.countInStock} left in stock`,
          });
        }
        med.countInStock -= item.qty;
        await med.save();
      }
    }

   const order = new Order({
  user: req.user._id,
  orderItems: orderItems || [],
  totalPrice: totalPrice || 0,
  paymentMethod,
  prescriptionImage,
  shippingAddress, // ✅ Now added here
  status: prescriptionImage ? "Prescription Uploaded" : "Pending",
});


    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed", error: err.message });
  }
};

// ✅ Confirm Cart Order (admin)
const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("orderItems.medicine");

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "Confirmed") {
      return res.status(400).json({ message: "Order already confirmed" });
    }

    // 🟡 No stock reduction here (already done during creation)

    order.status = "Confirmed";
    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();

    res.json({ message: "Order confirmed", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Confirm Prescription Order (Admin adds items manually)
const confirmPrescriptionOrder = async (req, res) => {
  try {
    const { items } = req.body; // [{ medicineId, quantity, price }]
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🟢 Reduce stock
    for (let item of items) {
      const med = await Medicine.findById(item.medicineId);
      if (!med) return res.status(404).json({ message: "Medicine not found" });
      if (med.countInStock < item.quantity) {
        return res.status(400).json({ message: `${med.name} is out of stock` });
      }
      med.countInStock -= item.quantity;
      await med.save();
    }

    // 📝 Format and set order items properly
    order.orderItems = items.map(item => ({
      medicine: item.medicineId,
      qty: item.quantity,
      price: item.price,
    }));
    order.totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    order.status = "Confirmed";
    order.isPaid = true;
    order.paidAt = Date.now();

    await order.save();
    res.json({ message: "Prescription order confirmed and stock updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Customer: Get Their Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: All Orders (with optional date filter)
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

// ✅ Admin: Get All Uploaded Prescriptions
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
