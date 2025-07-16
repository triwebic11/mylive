const express = require("express");
const router = express.Router();
const KYC = require("../models/KycModel");

// User submits KYC
router.post("/", async (req, res) => {
  const { userId, frontImage, backImage } = req.body;
  try {
    const existing = await KYC.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "KYC already submitted." });
    }

    const kyc = await KYC.create({ userId, frontImage, backImage });
    res.status(200).json(kyc);
  } catch (err) {
    res.status(500).json({ message: "KYC submission failed." });
  }
});

// Admin: verify KYC
router.patch("/verify/:id", async (req, res) => {
  try {
    const updated = await KYC.findByIdAndUpdate(
      req.params.id,
      { status: "verified" },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to verify" });
  }
});

// PATCH: /api/kyc/reject/:id
router.patch("/reject/:id", async (req, res) => {
  try {
    const updated = await KYC.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to reject" });
  }
});

// Admin: get all KYC requests
router.get("/", async (req, res) => {
  try {
    const kycs = await KYC.find().populate("userId", "name email");
    res.status(200).json(kycs);
  } catch (err) {
    res.status(500).json({ message: "Failed to get KYC list" });
  }
});

// User side: check verify status
router.get("/status/:userId", async (req, res) => {
  try {
    const kyc = await KYC.findOne({ userId: req.params.userId });
    res.status(200).json({ status: kyc?.status || "not_submitted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch status" });
  }
});

router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const kycData = await KYC.findOne({ userId });
    if (!kycData) {
      return res.json({ status: "not_submitted" });
    }

    return res.json({ status: kycData.status });
  } catch (error) {
    console.error("Error fetching KYC status:", error.message);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
});

module.exports = router;
