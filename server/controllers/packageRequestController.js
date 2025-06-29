const PackageRequest = require("../models/PackageRequest");
const distributeCommission = require("../utils/distributeCommission");
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

// exports.approveRequest = async (req, res) => {
//   try {
//     // 1. Approve package request
//     const request = await PackageRequest.findByIdAndUpdate(
//       req.params.id,
//       { status: "approved" },
//       { new: true }
//     );

//     if (!request) {
//       return res.status(404).json({ message: "Request not found." });
//     }

//     // 2. Update user package info
//     const { userId, packageName, packagePrice } = request;

//     const packageDurationDays = 30; // adjust if needed

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         package: {
//           name: packageName,
//           purchasedAt: new Date(),
//           expiresAt: new Date(Date.now() + packageDurationDays * 24 * 60 * 60 * 1000),
//         },
//         isActive: true,
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // 3. Distribute commission (based on 20-generation)
//     await distributeCommission(userId, packagePrice);

//     res.json({ message: "Package request approved and commission distributed." });
//   } catch (err) {
//     console.error("Approval error:", err);
//     res.status(500).json({ message: "Approval failed.", error: err.message });
//   }
// };

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
