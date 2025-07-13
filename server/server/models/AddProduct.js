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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
