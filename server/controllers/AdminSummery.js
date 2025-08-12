const AddProduct = require("../models/AddProduct");
const Order = require("../models/AdminOrder");
const RankUpgradeRequest = require("../models/RankUpgradeRequest");
const User = require("../models/User");

exports.AdminSummery = async (req, res) => {
  try {
    const users = await User.find();
    const userCount = users.length;
    const dspUsers = users.filter((user) => user.role === "dsp");
    const dspCount = dspUsers.length;
    const adminUsers = users.filter((user) => user.role === "admin");
    const adminCounts = adminUsers.length;
    const adminOrders = await Order.find({ createdBy: "admin" });
    const dspOrders = await Order.find({ orderedFor: "dsp" });
    const dspOrdersCount = dspOrders.length;
    const adminOrdersCount = adminOrders.length;
    const products = await AddProduct.find();
    const productCount = products.length;
    const rank = await RankUpgradeRequest.find();
    const rankCount = rank.length;
    res.status(200).json({
      userCount,
      adminOrdersCount,
      adminCounts,
      dspCount,
      productCount,
      dspOrdersCount,
      rankCount,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get admin summary", error: err });
  }
};
