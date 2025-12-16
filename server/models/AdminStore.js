const mongoose = require("mongoose");

const adminStoreSchema = new mongoose.Schema({
  datafrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Executive_Officer: { type: Number, min: 0 },
  Special_Fund: { type: Number, min: 0 },
  Car_Fund: { type: Number, min: 0 },
  Tour_Fund: { type: Number, min: 0 },
  Home_Fund: { type: Number, min: 0 },
  date: {
    type: String,
    default: () => new Date().toISOString(),
  },

   // 🆕 undistributed fields
  Executive_Officer_Undistributed: { type: Number, default: 0 },
  Special_Fund_Undistributed: { type: Number, default: 0 },
  Tour_Fund_Undistributed: { type: Number, default: 0 },
  Car_Fund_Undistributed: { type: Number, default: 0 },
  Home_Fund_Undistributed: { type: Number, default: 0 },
});

const AdminStore = mongoose.model("AdminStore", adminStoreSchema);

module.exports = AdminStore;
