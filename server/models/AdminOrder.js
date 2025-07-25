const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: String,
  productRate: Number,
  name: String, // ✅ Add this
  pointValue: Number,
  quantity: Number,
  subtotal: Number, // ✅ Add this
  subPoint: Number, // ✅ Add this
  subDiscount: Number, // ✅ Add this
  isRepurchaseFree: { type: Boolean, default: false },
  isConsistencyFree: { type: Boolean, default: false },
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
  grandPoint: Number, // ✅ Add this
  grandDiscount: Number, // ✅ Add this
  date: {
    type: String,
    default: new Date().toISOString(),
  },
});

const Order = mongoose.model("AdminOrder", adminOrderSchema);

module.exports = Order;
