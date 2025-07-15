const express = require("express");
const router = express.Router();
const Order = require("../models/DspOrder");

// Create Order (by DSP)
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Order creation failed", error });
  }
});

// Get All Orders (Admin)
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find().populate("dspUser", "name phone");
    res.json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update Status (Admin)
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get DSP User Orders
router.get("/user/:id", async (req, res) => {
  try {
    const orders = await Order.find({ dspUser: req.params.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
