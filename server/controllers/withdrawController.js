// controllers/withdrawController.js
const WithdrawRequest = require("../models/WithdrawRequest");
const User = require("../models/User"); // Assuming you have a User model
const TdsRate = require("../models/ConversionRate");
const createWithdrawRequest = async (req, res) => {
  const { name, phone, userId, totalwithdraw, totalTaka } = req.body;

  if (!name || !phone || !userId || !totalwithdraw || !totalTaka) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ Fetch user to get existing totalwithdraw
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // const newTotalWithdraw = (user.totalwithdraw || 0) + parseFloat(totalwithdraw);

    const newRequest = new WithdrawRequest({
      name,
      phone,
      userId,
      totalTaka,
      totalwithdraw: totalwithdraw,
      status: "pending",
    });

    await newRequest.save();

    res
      .status(201)
      .json({ message: "Withdraw request submitted", request: newRequest });
  } catch (error) {
    console.error("❌ Error creating withdraw request:", error);
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

     const tdsRate = await TdsRate.findOne();
      console.log("TDS Rate",tdsRate?.pointToTaka)

    // Prevent re-approving or re-rejecting
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = status;
    await request.save();

    if (status === "approved") {
      const user = await User.findById(request.userId);
      if (user) {
        const withdrawAmount = parseFloat(request.totalTaka);
        // const withdrowtaka = parseFloat(request?.totalTaka || 0)
        const currentPoints = parseFloat(user.points * tdsRate);
        const currentWithdraw = parseFloat(user.totalwithdraw || 0);

        // console.log("currentWithdraw amount:", currentWithdraw);


        if (isNaN(withdrawAmount)) {
          return res.status(400).json({ message: "Invalid withdraw amount" });
        }

        if (currentPoints < withdrawAmount) {
          return res.status(400).json({ message: "Insufficient points for withdrawal" });
        } 

        const newTotalWithdraw = (user.totalwithdraw || 0) + parseFloat(withdrawAmount);
        user.totalwithdraw = newTotalWithdraw;

        await user.save();

        // Optional: mark when processed
        request.processedAt = new Date();
        await request.save();


        // Emit socket event
        const io = req.app.get("io");
        io.emit("balance-updated", {
          userId: user._id.toString(),
          totalwithdraw: user.totalwithdraw,
          points: user.points,
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
