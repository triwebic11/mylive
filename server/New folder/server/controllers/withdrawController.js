// controllers/withdrawController.js
const WithdrawRequest = require("../models/WithdrawRequest");
const User = require("../models/User"); // Assuming you have a User model
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
    const request = await WithdrawRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Withdraw request not found" });
    }

    request.status = status;
    await request.save();

    if (status === "approved") {
      const user = await User.findById(request.userId);
      if (user) {
        // ✅ Point deduct
        user.points -= request.points;
        await user.save();

        // ✅ Emit socket event
        const io = req.app.get("io"); // socket instance
        io.emit("balance-updated", {
          userId: user._id.toString(),
          newPoints: user.points,
        });
      }
    }

    res.status(200).json({
      message: "Status updated successfully",
      updated: request,
    });
  } catch (error) {
    console.error("Error updating withdraw status:", error);
    res.status(500).json({ message: "Failed to update request status" });
  }
};

module.exports = {
  createWithdrawRequest,
  getAllWithdrawRequests,
  getWithdrawRequestsByUser,
  updateWithdrawStatus,
};
