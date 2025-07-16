const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    dspUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    phone: String,
    productId: String,
    quantity: Number,
    status: {
      type: String,
      enum: ["pending", "shipped"],
      default: "pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
