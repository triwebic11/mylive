const express = require("express");
const router = express.Router();
const { getCashonDelivery, CashonDeliverypost } = require("../controllers/CashOnDelivery");


router.post("/cashonDelivery", CashonDeliverypost);

router.get("/all", getCashonDelivery);


module.exports = router;
