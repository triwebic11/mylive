const mongoose = require("mongoose");

const conversionRateSchema = new mongoose.Schema(
  {
    pointToTaka: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConversionRate", conversionRateSchema);
