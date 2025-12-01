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
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    pointValue: {
      type: Number,
      default: 0,
    },

    productId: {
      type: Number,
      required: true,
    },
    productRole: {
      type: String,
      default: "paid",
    },
    isRepurchaseFree: { type: Boolean, default: false },
    isConsistencyFree: { type: Boolean, default: false },
    rfp: {
      type: Number,
      default: 0,
    },
    acfp: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
