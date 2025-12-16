// models/WithdrawRequest.js
const mongoose = require("mongoose");

const withdrawRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    phone: String,
    totalTaka: {
      type: Number,
      default: 0,
    },
    totalwithdraw: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    paymentMethod: "",
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WithdrawRequest", withdrawRequestSchema);
