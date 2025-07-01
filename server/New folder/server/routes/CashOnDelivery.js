const express = require("express");
const router = express.Router();
const { getCashonDelivery, CashonDeliverypost,updatecashondelivery } = require("../controllers/CashOnDelivery");


router.post("/cashonDelivery", CashonDeliverypost);
router.get("/all", getCashonDelivery);
router.patch("/:id", updatecashondelivery);


module.exports = router;
