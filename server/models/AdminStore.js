const mongoose = require("mongoose");


const adminStoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Executive_Officer: String,
  Special_Fund: String,
  Car_Fund: String,
  Tour_Fund:String,

  date: {
    type: String,
    default: new Date().toISOString(),
  },
});

const Order = mongoose.model("AdminStore", adminStoreSchema);

module.exports = Order;
