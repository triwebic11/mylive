const mongoose = require("mongoose");

const bankInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
  bkash: String,
  nagad: String,
  rocket: String,
  bankName: String,
  accountNumber: String,
  accountHolder: String,
  branch: String,
  routeNo: String,
});

module.exports = mongoose.model("BankInfo", bankInfoSchema);
