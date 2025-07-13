const mongoose = require("mongoose");

const PackagesModel = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: String,
    },
    PV: {
      type: Number,
    },
    decreasePV: {
      type: Number,
    },
    GenerationLevel: {
      type: Number,
    },
    MegaGenerationLevel: {
      type: Number,
    },
    description: {
      type: String,
    },
    features: {
      type: [String],
    },
  },
  {
    timestamps: true,
    collection: "Packages", // ✅ Force Mongoose to use exact collection name
  }
);

module.exports = mongoose.model("Packages", PackagesModel);
