const express = require("express");
const router = express.Router();
const {
  createPackageRequest,
  getAllRequests,
  approveRequest,
  getUserRequest,
} = require("../controllers/packageRequestController");

// POST - User sends a request
router.post("/", createPackageRequest);

// GET - Admin sees all requests
router.get("/", getAllRequests);

// PATCH - Admin approves request
router.patch("/approve/:id", approveRequest);

router.get("/:userId", getUserRequest);

module.exports = router;
