const express = require("express");
const router = express.Router();
const {
  getConversionRate,
  updateConversionRate,
} = require("../controllers/conversionController");

router.get("/", getConversionRate);
router.put("/", updateConversionRate); // Admin will use this

module.exports = router;
