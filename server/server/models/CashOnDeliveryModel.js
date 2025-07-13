const mongoose = require("mongoose");

const CashOnDeliverySchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("CashOnDeliveryModel", CashOnDeliverySchema);
