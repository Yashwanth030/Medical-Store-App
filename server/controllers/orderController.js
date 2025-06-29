const Order = require("../models/Order");

const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,      // e.g., "online" or "cod"
    slipImage,          // URL of uploaded slip (from frontend)
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items provided" });
  }

  try {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "online" ? "paid" : "pending",
      slipImage: paymentMethod === "online" ? slipImage : null,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

module.exports = { createOrder };
