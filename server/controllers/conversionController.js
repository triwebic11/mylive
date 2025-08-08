const ConversionRate = require("../models/ConversionRate");

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
// Admin set or update rate
const updateConversionRate = async (req, res) => {
  const { pointToTaka, newTdsValue } = req.body;
  try {
    let rate = await ConversionRate.findOne();
    if (rate) {
      rate.pointToTaka = pointToTaka;
      rate.tdsValue = newTdsValue;
      await rate.save();
    } else {
      rate = await ConversionRate.create({
        pointToTaka,
        tdsValue: newTdsValue,
      });
    }
    res.json({
      message: "Conversion rate and TDS value updated",
      pointToTaka: rate.pointToTaka,
      tdsValue: rate.tdsValue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update rate" });
  }
};

module.exports = {
  getConversionRate,
  updateConversionRate,
};
