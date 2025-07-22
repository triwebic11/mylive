const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: String,
  productRate: Number,
  name: String, // ✅ Add this
  pointValue: Number,
  quantity: Number,
  subtotal: Number, // ✅ Add this
});

const adminOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dspPhone: String,
  products: [productSchema],
  grandTotal: Number, // ✅ Add this
  date: {
    type: String,
    default: new Date().toISOString(),
  },
});

const Order = mongoose.model("AdminOrder", adminOrderSchema);

module.exports = Order;
