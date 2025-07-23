const express = require("express");
const router = express.Router();
const AdminOrder = require("../models/AdminOrder");

// 👉 POST: Admin creates an order
// server/routes/adminOrders.js
router.post("/", async (req, res) => {
  try {
    const { userId, dspPhone, products, grandTotal } = req.body;

    const newOrder = new AdminOrder({
      userId,
      dspPhone,
      products,
      grandTotal,
      date: new Date().toISOString(),
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
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
// 👉 GET: Fetch all orders or by user ID
router.get("/:_id", async (req, res) => {
  try {
    const orders = await AdminOrder.find({ userId: req.params._id }); // 🔄 _id → userId
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
