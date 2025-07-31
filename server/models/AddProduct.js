const { privateDecrypt } = require("crypto");
const mongoose = require("mongoose");
const { type } = require("os");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: [String], // array of image URLs
      required: true,
    },
    details: {
      type: String, // HTML content from TipTap
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mrpPrice: {
      type: Number,
    },
    pointValue: {
      type: Number,
    },
    productId: {
      type: Number,
      required: true,
    },
    rfp: Number,
    acfp: Number,
    productRole: {
      type: String,
      default: "paid",
    },
    isRepurchaseFree: { type: Boolean, default: false },
    isConsistencyFree: { type: Boolean, default: false },
    // isAdvanceConsistency: { type: Boolean, default: false },
    // isAddConsistencyFree: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
