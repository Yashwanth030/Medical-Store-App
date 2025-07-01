const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
      },
    ],
prescriptionImage: { type: String },
status: {
  type: String,
  enum: ["Pending", "Confirmed", "Delivered", "Prescription Uploaded"],
  default: "Prescription Uploaded",
},

    paymentMethod: {
      type: String,
      enum: ["QR", "COD", "Prescription"],
      default: "COD",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Prescription Uploaded", "Pending", "Confirmed", "Delivered"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
