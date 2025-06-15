const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    dob: { type: Date },
    referrerId: { type: String },
    placementId: { type: String },
    division: { type: String },
    city: { type: String },
    postcode: { type: String },
    address: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
     referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
