// 📁 routes/dspInventoryRoute.js

const express = require("express");
const router = express.Router();
const DspInventory = require("../models/DspInventory");

// router.post("/", async (req, res) => {
//   const { dspPhone, productId, quantity } = req.body;
//   try {
//     const existingInventory = await DspInventory.findOne({
//       dspPhone,
//       productId,
//     });
//     if (existingInventory) {
//       existingInventory.quantity += quantity; // Update quantity if exists
//       const updatedInventory = await existingInventory.save();
//       return res.status(200).json(updatedInventory);
//     } else {
//       const newInventory = new DspInventory({ dspPhone, productId, quantity });
//       const savedInventory = await newInventory.save();
//       return res.status(201).json(savedInventory);
//     }
//   } catch (error) {
//     console.error("Inventory creation error:", error);
//     return res.status(500).json({ message: "Failed to create inventory" });
//   }
// });

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
