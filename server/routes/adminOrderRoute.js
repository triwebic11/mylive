const express = require("express");
const router = express.Router();
const AdminOrder = require("../models/AdminOrder");

// 👉 POST: Admin creates an order
router.post("/", async (req, res) => {
  try {
    const newOrder = await AdminOrder.create(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err });
  }
});

// 👉 GET: Fetch orders by DSP phone number
router.get("/:phone", async (req, res) => {
  try {
    const orders = await AdminOrder.find({ dspPhone: req.params.phone });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await AdminOrder.find(); // ✅ সব order fetch করবে
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});

module.exports = router;
