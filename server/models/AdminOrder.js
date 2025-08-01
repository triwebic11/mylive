const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: String,
  freeProductId: { type: String, default: "" }, // ✅ Add this
  productRate: Number,
  freeProductRate: { type: Number, default: 0 }, // ✅ Add this
  mrpRate: Number,
  name: String, // ✅ Add this
  freeProductName: { type: String, default: "" }, // ✅ Add this
  pointValue: Number,
  quantity: Number,
  freeQuantity: Number, // ✅ Add this
  subtotal: Number, // ✅ Add this
  freeSubtotal: { type: Number, default: 0 }, // ✅ Add this
  subPoint: Number, // ✅ Add this
  subDiscount: Number, // ✅ Add this
  isRepurchaseFree: { type: Boolean, default: false },
  isRepurchaseFreeValue: { type: Number, default: 0 }, // ✅ Add this
  isConsistencyFree: { type: Boolean, default: false },
  isConsistencyFreeValue: { type: Number, default: 0 }, // ✅ Add this
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
  freeGrandTotal: { type: Number, default: 0 }, // ✅ Add this
  grandPoint: Number, // ✅ Add this
  grandDiscount: Number, // ✅ Add this
  date: {
    type: String,
    default: new Date().toISOString(),
  },
});

const Order = mongoose.model("AdminOrder", adminOrderSchema);

module.exports = Order;
