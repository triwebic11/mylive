// routes/withdrawRequests.js
const express = require("express");
const router = express.Router();
const {
  createWithdrawRequest,
  getAllWithdrawRequests,
  getWithdrawRequestsByUser,
} = require("../controllers/withdrawController");

router.post("/", createWithdrawRequest); // User will post a request
router.get("/", getAllWithdrawRequests); // Admin will view all requests
router.get("/user/:userId", getWithdrawRequestsByUser);

module.exports = router;
