const mongoose = require("mongoose");

const dspInventorySchema = new mongoose.Schema({
  dspPhone: { type: String, required: true }, // DSP এর ফোন
  productId: { type: String, required: true },
  productName: String,
  quantity: { type: Number, default: 0 },
});

const DspInventory = mongoose.model("DspInventory", dspInventorySchema);
module.exports = DspInventory;
