const mongoose = require("mongoose");

const accountInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
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

module.exports = mongoose.model("AccountInfo", accountInfoSchema);
