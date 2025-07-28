const User = require("../models/User");
const PackageRequest = require("../models/PackageRequest");
const PackagesModel = require("../models/PackagesModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Referral Code Generator
const generateReferralCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = Math.random().toString(36).substring(2, 10).toUpperCase(); // 8-digit
    exists = await User.findOne({ referralCode: code });
  }
  return code;
};

// Registration Controller
// const registerUser = async (req, res) => {
//   try {
//     const { name, phone, email, password, referralCode } = req.body;

//     const existingUser = await User.findOne({ phone });
//     if (existingUser)
//       return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newReferralCode = await generateReferralCode();

//     let referralTree = [];

//     if (referralCode) {
//       const parent = await User.findOne({ referralCode });

//       if (!parent) {
//         return res.status(400).json({ message: "Invalid referral code" });
//       }

//       referralTree = [
//         parent._id.toString(),
//         ...parent.referralTree.slice(0, 9),
//       ];
//     }

//     const newUser = await User.create({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       referralCode: newReferralCode,
//       referredBy: referralCode || null,
//       referralTree,
//     });

//     // Reward system – Add points to 10 uplines
//     // if (referralTree.length > 0) {
//     //   for (let i = 0; i < referralTree.length; i = 10) {
//     //     const uplineId = referralTree[i];
//     //     const point = 100 - i;

//     //     await User.findByIdAndUpdate(uplineId, {
//     //       $inc: { points: point },
//     //     });
//     //   }
//     // }

//     // ধরলাম newUser হচ্ছে যিনি register করলেন
//     if (referralTree.length > 0) {
//       // STEP 1: নতুন user এর package info বের করো
//       const childPackageReq = await PackageRequest.findOne({
//         userId: newUser._id,
//       });
//       const childPackageName = childPackageReq?.packageName;

//       const childPackageModel = await PackagesModel.findOne({
//         name: childPackageName,
//       });
//       const childStartPoint = childPackageModel?.PV;
//       const childDecreasePV = childPackageModel?.decreasePV || 100;

//       if (!childStartPoint) {
//         // console.log("❌ Child user's package PV not found");
//         return;
//       }

//       // STEP 2: Loop through all uplines
//       for (let i = 0; i < referralTree.length; i++) {
//         const uplineId = referralTree[i];
//         if (!uplineId) break;

//         // STEP 3: প্রতিটি upline user এর package details বের করো
//         const uplinePackageReq = await PackageRequest.findOne({
//           userId: uplineId,
//         });
//         const uplinePackageName = uplinePackageReq?.packageName;

//         const uplinePackageModel = await PackagesModel.findOne({
//           name: uplinePackageName,
//         });
//         const uplineGenerations = (() => {
//           switch (uplinePackageName) {
//             case "Business Relation":
//               return 10;
//             case "Business Relative":
//               return 7;
//             case "Family":
//               return 5;
//             case "Friend":
//               return 3;
//             default:
//               return 0;
//           }
//         })();

//         if (!uplineGenerations) {
//           // console.log(`⛔ Invalid or missing package for upline: ${uplineId}`);
//           continue;
//         }

//         // STEP 4: Check if this upline is eligible for this generation
//         if (i < uplineGenerations) {
//           const point = childStartPoint - i * childDecreasePV;

//           if (point > 0) {
//             await User.findByIdAndUpdate(uplineId, {
//               $inc: { points: point },
//             });

//             // console.log(
//               `✅ Upline ${uplineId} got ${point} points from generation ${i + 1
//               } based on child package`
//             );
//           } else {
//             // console.log(`⚠️ Point is 0 or less for upline ${uplineId}`);
//           }
//         } else {
//           // console.log(
//             `⛔ Upline ${uplineId} not eligible for generation ${i + 1}`
//           );
//         }
//       }
//     }

//     res.status(201).json({
//       message: "User registered successfully",
//       userId: newUser._id,
//       referralCode: newReferralCode,
//       referralTree,
//       points: newUser.points,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password, referralCode,placementBy } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Hash password and generate referral code
    const hashedPassword = await bcrypt.hash(password, 10);
    const newReferralCode = await generateReferralCode();

    // 3️⃣ Handle referral tree
    let referralTree = [];
    if (referralCode) {
      const parent = await User.findOne({ referralCode });

      if (!parent) {
        return res.status(400).json({ message: "Invalid referral code" });
      }

      referralTree = [
        parent._id.toString(),
        ...parent.referralTree.slice(0, 9),
      ];
    }

    // 4️⃣ Create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referralCode || null,
      referralTree,
      placementBy, // Include placement ID
    });

    // 5️⃣ ✅ Assign default package (optional but recommended)
    await PackageRequest.create({
      userId: newUser._id,
      packageName: "Friend", // Default package
    });

    // 6️⃣ Try point distribution if referral tree exists
    try {
      const childPackageReq = await PackageRequest.findOne({
        userId: newUser._id,
      });

      const childPackageName = childPackageReq?.packageName;
      const childPackageModel = await PackagesModel.findOne({
        name: childPackageName,
      });

      const childStartPoint = childPackageModel?.PV;
      const childDecreasePV = childPackageModel?.decreasePV || 100;

      if (!childStartPoint) {
        // console.log("❌ Child user's package PV not found");
      } else {
        for (let i = 0; i < referralTree.length; i++) {
          const uplineId = referralTree[i];
          if (!uplineId) break;

          const uplinePackageReq = await PackageRequest.findOne({
            userId: uplineId,
          });
          const uplinePackageName = uplinePackageReq?.packageName;

          const uplineGenerations = (() => {
            switch (uplinePackageName) {
              case "Business Relation":
                return 10;
              case "Business Relative":
                return 7;
              case "Family":
                return 5;
              case "Friend":
                return 3;
              default:
                return 0;
            }
          })();

          // if (i < uplineGenerations) {
          //   const point = childStartPoint - i * childDecreasePV;
          //   if (point > 0) {
          //     await User.findByIdAndUpdate(uplineId, {
          //       $inc: { points: point },
          //     });

          //     console.log(
          //       `✅ Upline ${uplineId} got ${point} points from generation ${
          //         i + 1
          //       } based on child package`
          //     );
          //   }
          // }
        }
      }
    } catch (bonusErr) {
      // console.log("🎯 Bonus distribution error:", bonusErr.message);
    }

    // 7️⃣ Respond to frontend
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
      referralCode: newReferralCode,
      placementBy,
      referralTree,
      points: newUser.points,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

// login Controller

const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.phone,
        referralCode: user.referralCode,
        referralTree: user.referralTree,
        points: user.points,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get All Users Controller
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // password বাদ দিয়ে সব data
    res.json(users);
  } catch (err) {
    console.error("Failed to get users:", err);
    res.status(500).json({ message: "Failed to get users" });
  }
};

// Get single user details
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

//update userInfo

const updatProfileInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
//getMyReferrals

const getMyReferrals = async (req, res) => {
  try {
    const { refCode } = req.params;

    const users = await User.find({ referredBy: refCode }).select(
      "name email createdAt"
    );

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//All users list

const getMyAllReferrals = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//getReferralTreeDetails

const getReferralTreeDetails = async (req, res) => {
  try {
    const { ids } = req.body;

    const users = await User.find({ _id: { $in: ids } }).select(
      "_id name email"
    );

    // preserve original order
    const orderedUsers = ids.map((id) =>
      users.find((u) => u._id.toString() === id)
    );

    res.status(200).json(orderedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserPassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // console.log("idddddddddddddddddd", id)

  try {
    const updatedRole = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    // console.log(updatedRole)

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({
      message: "Role updated successfully",
      user: updatedRole,
    });
  } catch (error) {
    console.error("Patch update failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Optional utility to generate summary from user
const generateUserSummary = (user, referredUsers = []) => {
  // console.log("Generating summary...");

  const incoming = user.AllEntry?.incoming || [];

  const getSumBySector = (sectorName) => {
    return incoming
      .filter((entry) => entry.sector === sectorName)
      .reduce((sum, entry) => sum + (entry.pointReceived || 0), 0);
  };

  const productPurchasePoints = getSumBySector("ProductPurchase");
  const referCommission = getSumBySector("ReferCommission");
  const generationCommission = getSumBySector("GenerationCommission");
  const megaCommission = getSumBySector("MegaCommission");
  const repurchaseSponsorBonus = getSumBySector("RepurchaseSponsorBonus");
  const repurchaseCommission = getSumBySector("RepurchaseCommission");
  const specialFund = getSumBySector("Special Fund");
  const withdrawableBalance = getSumBySector("Withdrawable");
  const totalWithdraw = getSumBySector("Withdraw");
  const totalTDS = getSumBySector("TDS");
  const carFund = getSumBySector("Car Fund");
  const tourFund = getSumBySector("Travel Fund");
  const homeFund = getSumBySector("House fund");
  const lifetimeBonus = getSumBySector("All life fund");
  const totalTeamSalePv = referredUsers.reduce((total, referredUser) => {
    const referredIncoming = referredUser.AllEntry?.incoming || [];
    return total + getSumBySector(referredIncoming, "ProductPurchase");
  }, 0);

  // ✅ Active & Free Team count
  const currentDate = new Date();
  const totalActiveTeam = referredUsers.filter(
    (rUser) =>
      rUser.packageExpireDate && new Date(rUser.packageExpireDate) > currentDate
  ).length;

  const totalFreeTeam = referredUsers.length - totalActiveTeam;

  // ✅ Filter incoming for previous month PV
  const currentMonth = currentDate.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // If Jan, then Dec (11)
  const currentYear = currentDate.getFullYear();
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const previousMonthPv = incoming
    .filter((entry) => {
      const date = new Date(entry.date);
      return (
        date.getMonth() === previousMonth &&
        date.getFullYear() === previousMonthYear
      );
    })
    .reduce((sum, entry) => sum + (entry.pointReceived || 0), 0);

  // ✅ Current Month PV
  const currentMonthPv = incoming
    .filter((entry) => {
      const date = new Date(entry.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    })
    .reduce((sum, entry) => sum + (entry.pointReceived || 0), 0);

  const monthlyDownSalePv = previousMonthPv - currentMonthPv;
  const getSumAmountBySector = (sectorName) => {
    return incoming
      .filter((entry) => entry.sector === sectorName)
      .reduce((sum, entry) => sum + (entry.amount || 0), 0);
  };
  const totalPurchaseAmount = getSumAmountBySector("ProductPurchase");

  const getSumPointBySectorInLastNDays = (sectorName, days) => {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    return incoming
      .filter(
        (entry) =>
          entry.sector === sectorName && new Date(entry.date) >= dateLimit
      )
      .reduce((sum, entry) => sum + (entry.pointReceived || 0), 0);
  };

  const currentPurchaseAmount = getSumPointBySectorInLastNDays(
    "ProductPurchase",
    10
  );

  return [
    { title: "Total Refer", value: user.referralTree?.length || 0 },
    { title: "Total Free Team", value: totalFreeTeam },
    { title: "Total Active Team", value: totalActiveTeam },
    {
      title: "Currently Expired",
      value: new Date(user.packageExpireDate) < new Date() ? 1 : 0,
    },
    { title: "Total Voucher", value: 0 },
    { title: "Previous Month Pv", value: previousMonthPv },
    {
      title: "Current Month Pv",
      value: currentMonthPv,
    },
    {
      title: "Monthly down sale pv",
      value: previousMonthPv >= currentMonthPv && monthlyDownSalePv,
    },
    { title: "Total Team Sale Pv", value: totalTeamSalePv },
    { title: "Total Team Member", value: user.referralTree?.length || 0 },
    { title: "Current Purchase Amount", value: currentPurchaseAmount },
    { title: "Total Purchase Amount", value: totalPurchaseAmount },
    { title: "Total Purchase Pv", value: productPurchasePoints },
    { title: "Refer Commission", value: referCommission },
    { title: "Generation Commission", value: generationCommission },
    { title: "Mega Commission", value: megaCommission },
    { title: "Repurchase Sponsor Bonus", value: repurchaseSponsorBonus },
    { title: "Repurchase Commission", value: repurchaseCommission },
    { title: "Withdrawable Balance", value: withdrawableBalance },
    { title: "Total Withdraw", value: totalWithdraw },
    { title: "Total TDS", value: totalTDS },
    { title: "Special Fund", value: specialFund },
    { title: "Executive Officer", value: specialFund },
    { title: "Car Fund", value: carFund },
    { title: "Tour Fund", value: tourFund },
    { title: "Home Fund", value: homeFund },
    { title: "Lifetime Bonus", value: lifetimeBonus },
  ];
};

const userAgregateData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Fetch referred users based on referralTree
    const referredUsers = await User.find({
      _id: { $in: user.referralTree || [] },
    });

    const summary = generateUserSummary(user, referredUsers);

    res.status(200).json({
      success: true,
      userId: user._id,
      name: user.name,
      email: user.email,
      summary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
async function buildTree(userId) {
  // console.log("Building tree for user:", userId);
  const user = await User.findById(userId);
  if (!user) return null;

  // console.log("Building tree for user:", user.name);

  // 🔍 Find users who have this user's referral code in either placementBy or referredBy
  const children = await User.find({
    $or: [
      { placementBy: user.referralCode },
      { referredBy: user.referralCode },
    ]
  });

  // console.log("Children found:", children.length);

  // Recursively build tree for all children
  const childrenTrees = await Promise.all(
    children.map(child => buildTree(child._id))
  );

  return {
    name: user.name,
    _id: user._id,
    Position: user.Position,
    phone: user?.phone,
    referralCode: user.referralCode,
    referredBy: user.referredBy,
    placementBy: user.placementBy,
    left: childrenTrees[0] || null,
    right: childrenTrees[1] || null,
    // children: childrenTrees, // 🌲 full array of children
  };
}

const getReferralTreeById = async (req, res) => {
  try {
    const { userId } = req.params;
    const tree = await buildTree(userId);
    // console.log("Referral Tree for:", userId);
    res.json(tree);
  } catch (err) {
    console.error("Tree build error:", err);
    res.status(500).json({ error: "Failed to fetch referral tree" });
  }
};



module.exports = {
  registerUser,
  loginUser,
  getMyReferrals,
  getReferralTreeDetails,
  getMyAllReferrals,
  updateUserPassword,
  getAllUsers,
  getUserById,
  updatProfileInfo,
  updateUserRole,
  userAgregateData,
  getReferralTreeById
};
