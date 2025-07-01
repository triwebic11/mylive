const mongoose = require("mongoose");

const PackageRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  phone: String,
  packageName: String,
  packagePrice: String,
  status: { type: String, default: "pending" }, // pending, approved, rejected
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PackageRequest", PackageRequestSchema);
