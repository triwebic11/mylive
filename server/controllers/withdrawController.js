// controllers/withdrawController.js
const WithdrawRequest = require("../models/WithdrawRequest");

const createWithdrawRequest = async (req, res) => {
  const { name, phone, userId, points } = req.body;

  if (!name || !phone || !userId || !points) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newRequest = new WithdrawRequest({
      name,
      phone,
      userId,
      points,
      status: "pending", // default
    });

    await newRequest.save();

    res
      .status(201)
      .json({ message: "Withdraw request submitted", request: newRequest });
  } catch (error) {
    console.error("Error creating withdraw request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllWithdrawRequests = async (req, res) => {
  try {
    const requests = await WithdrawRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching withdraw requests:", error);
    res.status(500).json({ message: "Failed to load withdraw requests" });
  }
};

const getWithdrawRequestsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const requests = await WithdrawRequest.find({
      userId,
      status: "approved",
    }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Failed to fetch user withdraw history", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateWithdrawStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await WithdrawRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Withdraw request not found" });
    }

    res.status(200).json({ message: "Status updated", request: updated });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createWithdrawRequest,
  getAllWithdrawRequests,
  getWithdrawRequestsByUser,
  updateWithdrawStatus,
};
