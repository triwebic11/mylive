// routes/withdrawRequests.js
const express = require("express");
const router = express.Router();
const {
  createWithdrawRequest,
  getAllWithdrawRequests,
  getWithdrawRequestsByUser,
  updateWithdrawStatus,
} = require("../controllers/withdrawController");

router.post("/", createWithdrawRequest); // User will post a request
router.get("/", getAllWithdrawRequests); // Admin will view all requests
router.get("/user/:userId", getWithdrawRequestsByUser);
router.patch("/:id/status", updateWithdrawStatus);


module.exports = router;
