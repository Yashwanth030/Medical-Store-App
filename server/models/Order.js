const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: false,
      },
      quantity: { type: Number },
    },
  ],
slipImage: { type: String },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
paymentMode: { type: String, enum: ["online", "cod"], required: true },
paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  deliveryStatus: {
    type: String,
    enum: ["not delivered", "delivered"],
    default: "not delivered",
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);



