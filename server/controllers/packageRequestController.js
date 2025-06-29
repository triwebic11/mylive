const PackageRequest = require("../models/PackageRequest");

// ➤ Send request to admin
exports.createPackageRequest = async (req, res) => {
  try {
    const newRequest = new PackageRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: "Package request sent to admin." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send request.", error: err.message });
  }
};

// ➤ Get all requests (admin)
exports.getAllRequests = async (req, res) => {
  try {
    const allRequests = await PackageRequest.find().sort({ createdAt: -1 });
    res.json(allRequests);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching requests.", error: err.message });
  }
};

// ➤ Approve a request (admin)
exports.approveRequest = async (req, res) => {
  try {
    await PackageRequest.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });
    res.json({ message: "Package request approved." });
  } catch (err) {
    res.status(500).json({ message: "Approval failed.", error: err.message });
  }
};

// ➤ Get specific user's request (optional)
exports.getUserRequest = async (req, res) => {
  try {
    const userId = req.params.userId;
    const request = await PackageRequest.findOne({ userId });
    res.json(request);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user request.", error: err.message });
  }
};
