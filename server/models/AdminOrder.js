const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: String,
  productRate: Number,
  quantity: Number,
  subtotal: Number, // ✅ Add this
});

const adminOrderSchema = new mongoose.Schema({
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
