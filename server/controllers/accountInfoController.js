const AccountInfo = require("../models/AccountInfo");

// Create new account info
const createAccountInfo = async (req, res) => {
  try {
    const { userId, ...data } = req.body;

    const existing = await AccountInfo.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "Info already exists" });
    }

    const info = new AccountInfo({ userId, ...data });
    await info.save();
    res.status(201).json(info);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update existing info
const updateAccountInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const updated = await AccountInfo.findOneAndUpdate(
      { userId },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};

// Get user account info
const getAccountInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const info = await AccountInfo.findOne({ userId });
    res.json(info || {});
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};

module.exports = {
  createAccountInfo,
  updateAccountInfo,
  getAccountInfo,
};
