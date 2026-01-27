// 📁 routes/dspInventoryRoute.js

const express = require("express");
const router = express.Router();
const DspInventory = require("../models/DspInventory");

router.get("/:dspPhone", async (req, res) => {
  try {
    const dspPhone = req.params.dspPhone;
    const inventory = await DspInventory.find({ dspPhone });
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Inventory fetch error:", error);
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
});

module.exports = router;
