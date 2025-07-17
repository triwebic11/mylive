const PackageRequest = require("../models/PackageRequest");
const User = require("../models/User");
const distributeCommission = require("../utils/distributeReferralCommission.js");
const Packages = require("../models/PackagesModel.js");

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

exports.approveRequest = async (req, res) => {
  try {
    const request = await PackageRequest.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    console.log("✅ Approved Request:", request);

    const user = await User.findById(request.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const pkg = await Packages.findOne({ name: request.packageName });
    console.log("🎁 Matched Package:", pkg);
    await User.findByIdAndUpdate(user?._id, {
      package: request.packageName,
      GenerationLevel: request.GenerationLevel ?? pkg?.GenerationLevel,
      MegaGenerationLevel: request.MegaGenerationLevel ?? pkg?.MegaGenerationLevel,
      packageExpireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });


    res.json({ message: "✅ Package request approved and user updated." });

  } catch (err) {
    console.error("❌ Approval Error:", err);
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

    const requests = await PackageRequest.find({ userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user request.", error: err.message });
  }
};
