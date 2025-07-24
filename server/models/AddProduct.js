const mongoose = require("mongoose");

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
    pointValue: {
      type: Number,
      required: true,
    },
    productId: {
      type: Number,
      required: true,
    },

    // ✅ New Fields
    repurchaseFreeProduct: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    consistencyFreeProduct: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    advanceConsistency: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    addConsistencyFreeProduct: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
