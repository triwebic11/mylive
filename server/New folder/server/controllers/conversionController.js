const ConversionRate = require("../models/conversionRate");

// Get current conversion rate
const getConversionRate = async (req, res) => {
  try {
    const rate = await ConversionRate.findOne().sort({ updatedAt: -1 });
    res.json(rate);
  } catch (err) {
    res.status(500).json({ message: "Failed to get rate" });
  }
};

// Admin set or update rate
const updateConversionRate = async (req, res) => {
  const { pointToTaka } = req.body;
  try {
    const rate = await ConversionRate.findOne();
    if (rate) {
      rate.pointToTaka = pointToTaka;
      await rate.save();
    } else {
      await ConversionRate.create({ pointToTaka });
    }
    res.json({ message: "Conversion rate updated", pointToTaka });
  } catch (err) {
    res.status(500).json({ message: "Failed to update rate" });
  }
};

module.exports = { getConversionRate, updateConversionRate };
