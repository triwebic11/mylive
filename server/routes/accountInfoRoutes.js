const express = require("express");
const router = express.Router();

const {
  createBankInfo,
  getBankInfo,
  updateBankInfo,
} = require("../controllers/bankInfoController");

// Create
router.post("/accoutsInfo", createBankInfo);

// Get by userId
router.get("/accoutsInfo/:userId", getBankInfo);

// Update by userId
router.put("/:userId", updateBankInfo);

module.exports = router;
