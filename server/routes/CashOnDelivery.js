const express = require("express");
const router = express.Router();
const { getCashonDelivery, CashonDeliverypost,updatecashondelivery,userBasedCashonDelivery } = require("../controllers/CashOnDelivery");


router.post("/postdata", CashonDeliverypost);
router.get("/all", getCashonDelivery);
router.get("/user/:id", userBasedCashonDelivery); // Assuming this is for user-specific orders
router.patch("/:id", updatecashondelivery);


module.exports = router;
