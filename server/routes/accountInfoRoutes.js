const express = require("express");
const router = express.Router();

const {
  createBankInfo,
  getBankInfo,
  updateBankInfo,
  getAllAccountInfo,
} = require("../controllers/bankInfoController");

// Create
router.post("/accountsInfo", createBankInfo);

// Get by userId
router.get("/accountsInfo/:userId", getBankInfo);

router.get("/all", getAllAccountInfo);

router.put("/:userId", updateBankInfo);

module.exports = router;
