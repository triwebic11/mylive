const mongoose = require("mongoose");

const DspReturnRequestSchema = new mongoose.Schema({
  dspPhone: { type: String, required: true },
  productId: { type: String, required: true },
  productName: String,
  quantity: { type: Number, required: true },
  note: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DspReturnRequest", DspReturnRequestSchema);
