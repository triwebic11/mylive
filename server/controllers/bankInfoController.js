const BankInfo = require("../models/BankInfo");

// ✅ Create Bank Info
exports.createBankInfo = async (req, res) => {
  try {
    const { userId, ...rest } = req.body;

    const exists = await BankInfo.findOne({ userId });
    if (exists) {
      return res.status(400).json({ message: "Bank info already exists!" });
    }

    const newInfo = new BankInfo({ userId, ...rest });
    await newInfo.save();
    res.status(201).json({ message: "Bank info created", data: newInfo });
  } catch (err) {
    res.status(500).json({ message: "Failed to create bank info", error: err });
  }
};

// ✅ Get Bank Info
exports.getBankInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const info = await BankInfo.findOne({ userId });
    if (!info) return res.status(404).json({ message: "No info found" });
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bank info", error: err });
  }
};

// ✅ Update Bank Info
exports.updateBankInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const updated = await BankInfo.findOneAndUpdate(
      { userId },
      { ...req.body },
      { new: true, upsert: true } // create if not exists
    );
    res.status(200).json({ message: "Bank info updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update bank info", error: err });
  }
};
