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
    mrpPrice: {
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

    isRepurchaseFree: { type: Boolean, default: false },
    isConsistencyFree: { type: Boolean, default: false },
    // isAdvanceConsistency: { type: Boolean, default: false },
    // isAddConsistencyFree: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
