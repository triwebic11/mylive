const RankUpgradeRequest = require("../models/RankUpgradeRequest");

exports.getRanksRequest = async (req, res) => {
  try {
    const requests = await RankUpgradeRequest.find().sort({ createdAt: -1 });

    // console.log("Fetched Rank Upgrade Requests:", requests);
    res.json(requests);
  } catch (error) {
    console.error("Error fetching rank update requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rank update requests",
      error: error.message,
    });
  }
};

exports.RankUpdateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("Updating Rank Upgrade Request:", id, "to status:", status);

    const updated = await RankUpgradeRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Rank request not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating rank status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};
