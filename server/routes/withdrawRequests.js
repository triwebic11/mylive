// routes/withdrawRequests.js
const express = require("express");
const router = express.Router();
const {
  createWithdrawRequest,
  getAllWithdrawRequests,
} = require("../controllers/withdrawController");

router.post("/", createWithdrawRequest); // User will post a request
router.get("/", getAllWithdrawRequests); // Admin will view all requests

module.exports = router;
