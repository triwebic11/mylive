const User = require("../models/User");
const PackageRequest = require("../models/PackageRequest");
const PackagesModel = require("../models/PackagesModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const AdminOrder = require("../models/AdminOrder");
const RankUpgradeRequest = require("../models/RankUpgradeRequest");
const TdsRate = require("../models/ConversionRate");

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

const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password, referralCode, placementBy, role } =
      req.body;

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

    // JWT generate
    const token = jwt.sign(
      {
        user: {
          name: name,
          email: phone,
          role: role,
          referralCode: referralCode,
        },
      },
      process.env.ACCESS_Token,
      { expiresIn: "1h" }
    );
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
      role,
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

          // const uplineGenerations = (() => {
          //   switch (uplinePackageName) {
          //     case "Business Relation":
          //       return 10;
          //     case "Business Relative":
          //       return 7;
          //     case "Family":
          //       return 5;
          //     case "Friend":
          //       return 3;
          //     default:
          //       return 0;
          //   }
          // })();

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

    const token = jwt.sign({ user }, process.env.ACCESS_Token, {
      expiresIn: "1h",
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

async function buildUplineChainMultipleParents(
  userId,
  depth = 0,
  maxDepth = 10,
  visited = new Set()
) {
  if (depth > maxDepth) return [];

  const user = await User.findById(userId).lean();
  if (!user || visited.has(user._id.toString())) return [];

  visited.add(user._id.toString());

  const parents = await User.find({
    $or: [
      { referralCode: user.referredBy },
      { referralCode: user.placementBy },
    ].filter((cond) => Object.values(cond)[0]),
  }).lean();

  if (!parents.length) {
    return [user];
  }

  let chains = [];

  for (const parent of parents) {
    const chain = await buildUplineChainMultipleParents(
      parent._id,
      depth + 1,
      maxDepth,
      visited
    );
    chains.push(...chain);
  }

  // Optional: remove duplicates and sort if needed
  // For simplicity, just return parents + current user as linear array
  return [...chains, user];
}

// async function buildUplineTree(userId, depth = 0, maxDepth = 10, visited = new Set()) {
//   if (depth > maxDepth) return [];

//   const user = await User.findById(userId);
//   if (!user || visited.has(user._id.toString())) return [];

//   visited.add(user._id.toString());

//   const query = [];
//   if (user.referredBy) query.push({ referralCode: user.referredBy });
//   if (user.placementBy) query.push({ referralCode: user.placementBy });

//   const parent = await User.findOne({ $or: query });

//   const currentNode = {
//     name: user.name,
//     _id: user._id,
//     phone: user.phone,
//     referralCode: user.referralCode,
//     referredBy: user.referredBy,
//     placementBy: user.placementBy,
//     GenerationLevel: user.GenerationLevel ?? 0
//   };

//   if (!parent) {
//     return [currentNode];
//   }

//   const parentTree = await buildUplineTree(parent._id, depth + 1, maxDepth, visited);
//   return [...parentTree, currentNode];
// }

// Optional utility to generate summary from user
const generateUserSummary = async (user, referredUsers = []) => {
  // console.log("Generating summary...");

  const incoming = user.AllEntry?.incoming || [];

  const getSumBySector = (sectorName) => {
    // console.log("Calculating sum for sector:", sectorName);

    const total = incoming
      .filter((entry) => entry.sector === sectorName)
      .reduce((sum, entry) => sum + (entry.pointReceived || 0), 0);
    // console.log("Total for sector", sectorName, "is", total);

    return parseFloat(total.toFixed(2));
  };

  const productPurchasePoints = getSumBySector("ProductPurchase");
  const referCommission = getSumBySector("20% referrer commission");
<<<<<<< HEAD
=======
  

>>>>>>> 1d5b9bb95204f22f380471571377a335ceb2a17c
  const generationCommission = getSumBySector("Shared Generation Commission");
  const megaCommission = getSumBySector("Shared Mega Generation Commission");
  const repurchaseSponsorBonus = getSumBySector("20% referrer commission");
  const repurchaseCommission = getSumBySector(
    "10% Personal reward from purchase"
  );

  console.log("Repurchase Commission:", repurchaseCommission);
  const specialFund = getSumBySector("Special Fund Commission");
  const totalTDS = getSumBySector("TDS");
  const carFund = getSumBySector("Car Fund Commission");
  const tourFund = getSumBySector("Travel Fund Commission");
  const homeFund = getSumBySector("House Fund Commission");
  const executiveOfficer = getSumBySector("Executive Officer Commission");

  // console.log("Referral Tree:", referredUsers);
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
    .reduce((sum, entry) => sum + (entry.pointReceived || 0), 0)
    .toFixed(2);

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

    // console.log("incomingsnnnnnnnnnnnnnnnnn", incoming);



    // Filter entries
  const filtered = incoming.filter((entry) => {
    const entryDate = new Date(entry.date);
        // console.log("DATE LIMIT:", dateLimit);
// console.log("filtered data", filtered);
    return (
      entry.sector === sectorName &&
      entryDate >= dateLimit
    );
  });

  // console.log("👉 Filtered Entries:****", filtered);

  // Reduce purchaseAmount
  const total = filtered.reduce((sum, entry) => {
    const amount = Number(entry.purchaseAmount || 0);
    return sum + amount;
  }, 0);

  // console.log("👉 TOTAL purchaseAmount:", total);

  return total;
  };

  const currentPurchaseAmount = getSumPointBySectorInLastNDays(
    "10% Personal reward from purchase",
    10
  );
  // console.log("Current Purchase Amount:", currentPurchaseAmount);

  const points = parseFloat(user?.points) || 0;
  const totalWithdraws = parseFloat(user?.totalwithdraw) || 0; // note: your field is totalwithdraw, not totalWithdraw
  const withdrawableBalance = (points - totalWithdraws).toFixed(2);

  // console.log("Withdrawable Balance:", withdrawableBalance);

  function countUsersInTree(tree) {
    if (!tree) return 0;
    const leftCount = countUsersInTree(tree.left);
    const rightCount = countUsersInTree(tree.right);
    return 1 + leftCount + rightCount; // 1 for current user
  }
  function sumPointsInTree(tree) {
    if (!tree) return 0;

    const leftPoints = sumPointsInTree(tree.left);
    const rightPoints = sumPointsInTree(tree.right);
    const currentPoints = tree.points || 0;

    return currentPoints + leftPoints + rightPoints;
  }

  const userTree = await buildTree(user?._id);
function collectChildIds(node) {
  if (!node) return [];

  let ids = [];

  if (node.left) ids = ids.concat(collectChildIds(node.left));
  if (node.right) ids = ids.concat(collectChildIds(node.right));

  // current node push করব, কিন্তু root বাদ দেবো পরে
  ids.push(node._id);

  return ids;
}


let allIds = collectChildIds(userTree);

// নিজের root ID বাদ দেওয়া
allIds = allIds.filter(id => String(id) !== String(user._id));
const fullUsers = await User.find({ _id: { $in: allIds } });

  // Total points in left and right downlines, excluding self
  const totalDownlinePoints =
    sumPointsInTree(userTree.left) + sumPointsInTree(userTree.right);

  // console.log("Total points in downline:", totalDownlinePoints);
  const totalUsersInTree = countUsersInTree(userTree);
  // console.log(`Total users in tree: ${totalUsersInTree}`);

  const users = await User.find().select("-password");
  const totalreferral = users.filter((u) => u.referredBy === user.referralCode);

  // console.log("Tuser", user);

  const totalActiveTeams = fullUsers.filter(
    (u) => u.isActivePackage === "active"
  ).length;
  const totalexpireTeams = fullUsers.filter(
    (u) => u.isActivePackage === "expired"
  ).length;

  // console.log("Total Active Teams:", totalActiveTeams);
  // console.log("Total Expired Teams:", totalexpireTeams);

  const tree = await buildTree(user?._id);

  const totalPointsFromLeft = tree?.totalPointsFromLeft || 0;
  const totalPointsFromRight = tree?.totalPointsFromRight || 0;
  const totalBinaryPoints = totalPointsFromLeft + totalPointsFromRight;

  const orders = await AdminOrder.find({ dspPhone: user?.phone });

  let totalTdsValue = 0;
  const tdsRate = await TdsRate.findOne();

  // console.log("Refer Commission ---- :", referCommission, tdsRate?.pointToTaka);
  // console.log("TDS Rate", tdsRate?.pointToTaka);
  try {
    const tdsRateValue = tdsRate ? tdsRate.tdsValue : 0;
    totalTdsValue = (user?.totalwithdraw * tdsRateValue) / 100;

    await user.save();
  } catch (error) {
    console.error("Error calculating TDS:", error);
    user.totalTDS = 0; // Default to 0 if error occurs
    await user.save();
  }

  return [
    { title: "Total Refer", value: totalreferral.length || 0 },
    { title: "Total Free Team", value: totalUsersInTree - 1 },
    { title: "Total Active Team", value: totalActiveTeams },
    {
      title: "Currently Expired",
      value: totalexpireTeams,
    },
    { title: "Total Voucher", value: orders?.length || 0 },
    // { title: "Previous Month BV", value: previousMonthPv || 0 },
    {
      title: "Team Total BV",
      value: `${tree?.totalPointsFromLeft} (Left) + ${tree?.totalPointsFromRight} (Right)`,
    },
    {
      title: "Team Current Month BV",
      value: `${tree?.monthlyleftBV} (Left) + ${tree?.monthlyrightBV} (Right)`,
    },
    {
      title: "Team previous Month PV",
      value: `${tree?.previousMonthlyLeftSubtreeBV} (Left) + ${tree?.previousMonthlyRightSubtreeBV} (Right)`,
    },
    {
      title: "Monthly down sale BV",
      value: totalDownlinePoints.toFixed(2) || 0,
    },
    { title: "Total Team Sale BV", value: totalBinaryPoints.toFixed(2) || 0 },
    { title: "Total Team Member", value: totalUsersInTree - 1 || 0 },
    { title: "Current Purchase Amount ৳", value: currentPurchaseAmount},
    { title: "Total Purchase Amount ৳", value: user?.totalAmount },
    { title: "Total Purchase BV", value: repurchaseCommission },
    { title: "Refer Commission ৳", value: (referCommission * tdsRate?.pointToTaka).toFixed(2) },
    { title: "Generation Commission ৳", value: (generationCommission * tdsRate?.pointToTaka).toFixed(2) },
    { title: "Mega Commission ৳", value: (megaCommission * tdsRate?.pointToTaka).toFixed(2) },
    { title: "Refar Sponsar Commission ৳", value: (user?.referSponsorbonus * tdsRate?.pointToTaka).toFixed(2) },
    { title: "Repurchase Commission ৳", value: (repurchaseCommission * tdsRate?.pointToTaka).toFixed(2) },
    { title: "Withdrawable Balance ৳", value: (withdrawableBalance * tdsRate?.pointToTaka).toFixed(2) },
    { title: "Total Withdraw", value: (user?.totalwithdraw * tdsRate?.pointToTaka).toFixed(2) },
    { title: "Executive Officer ৳", value: executiveOfficer * tdsRate?.pointToTaka },
    { title: "Special Fund ৳", value: specialFund * tdsRate?.pointToTaka },
    { title: "Car Fund ৳", value: carFund * tdsRate?.pointToTaka },
    { title: "Tour Fund ৳", value: tourFund * tdsRate?.pointToTaka },
    { title: "Home Fund ৳", value: homeFund * tdsRate?.pointToTaka },
    { title: "Total TDS ৳", value: totalTdsValue.toFixed(2) * tdsRate?.pointToTaka },
  ];
};
const generateUserSummaryStatements = async (user, referredUsers = []) => {
  const incoming = user.AllEntry?.incoming || [];

  // Today's date range
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  // Sum for today's entries by sector
  const getSumBySector = (sectorName) => {
    const total = incoming
      .filter(
        (entry) =>
          entry.sector === sectorName &&
          new Date(entry.date) >= startOfDay &&
          new Date(entry.date) <= endOfDay
      )
      .reduce((sum, entry) => sum + (entry.pointReceived || 0), 0);

    return parseFloat(total.toFixed(2));
  };

  const productPurchasePoints = getSumBySector("ProductPurchase");
  const referCommission = getSumBySector("20% referrer commission");
  // console.log("Refer Commission Today:", referCommission);
  const generationCommission = getSumBySector("Shared Generation Commission");
  const megaCommission = getSumBySector("Shared mega Generation Commission");
  // const repurchaseSponsorBonus = getSumBySector("RepurchaseSponsorBonus");
  const repurchaseCommission = getSumBySector(
    "10% Personal reward from purchase"
  );
  const specialFund = getSumBySector("Special Fund Commission");
  const carFund = getSumBySector("Car Fund Commission");
  const tourFund = getSumBySector("Travel Fund Commission");
  const homeFund = getSumBySector("House Fund Commission");
  const executiveOfficer = getSumBySector("Executive Officer Commission");

  // Points, withdraw, etc. (also filtered by today's date if needed)
  const points = productPurchasePoints; // Today’s total purchase points
  const totalWithdraws = 0; // Only today's withdraw if you track by date
  const withdrawableBalance = points - totalWithdraws;

  let totalTdsValue = 0;
  const tdsRate = await TdsRate.findOne();
  try {
    const tdsRateValue = tdsRate ? tdsRate.tdsValue : 0;
    totalTdsValue = (totalWithdraws * tdsRateValue) / 100;
    await user.save();
  } catch (error) {
    console.error("Error calculating TDS:", error);
    user.totalTDS = 0;
    await user.save();
  }

  return [
    {
      title: "Generation Commission ৳",
      value: (generationCommission * tdsRate?.pointToTaka).toFixed(2),
    },
    {
      title: "Mega Commission ৳",
      value: (megaCommission * tdsRate?.pointToTaka).toFixed(2),
    },
    {
      title: "Refer Commission ৳",
      value: (referCommission * tdsRate?.pointToTaka).toFixed(2),
    },
    {
      title: "Repurchase Commission ৳",
      value: (repurchaseCommission * tdsRate?.pointToTaka).toFixed(2),
    },
    {
      title: "Withdrawable Balance ৳",
      value: (withdrawableBalance * tdsRate?.pointToTaka).toFixed(2),
    },
    {
      title: "Total Withdraw ৳",
      value: (totalWithdraws * tdsRate?.pointToTaka).toFixed(2),
    },
    {
      title: "Total TDS ৳",
      value: totalTdsValue.toFixed(2) * tdsRate?.pointToTaka,
    },
    {
      title: "Executive Officer ৳",
      value: executiveOfficer * tdsRate?.pointToTaka,
    },
    { title: "Special Fund ৳", value: specialFund * tdsRate?.pointToTaka },
    { title: "Car Fund ৳", value: carFund * tdsRate?.pointToTaka },
    { title: "Tour Fund ৳", value: tourFund * tdsRate?.pointToTaka },
    { title: "Home Fund ৳", value: homeFund * tdsRate?.pointToTaka },
  ];
};
const generateUserSummaryCommissionStatements = async (
  user,
  referredUsers = []
) => {
  const incoming = user.AllEntry?.incoming || [];

  // Sum for all-time entries by sector (no date filter)
  const getSumBySector = (sectorName) => {
    const total = incoming
      .filter((entry) => entry.sector === sectorName)
      .reduce((sum, entry) => sum + (entry.pointReceived || 0), 0);

    return parseFloat(total.toFixed(2));
  };

  const productPurchasePoints = getSumBySector("ProductPurchase");
  const referCommission = getSumBySector("20% referrer commission");
  const generationCommission = getSumBySector("Shared Generation Commission");
  const megaCommission = getSumBySector("Shared mega Generation Commission");
  const repurchaseSponsorBonus = getSumBySector("RepurchaseSponsorBonus");
  const repurchaseCommission = getSumBySector(
    "10% Personal reward from purchase"
  );
  const specialFund = getSumBySector("Special Fund Commission");
  const carFund = getSumBySector("Car Fund Commission");
  const tourFund = getSumBySector("Travel Fund Commission");
  const homeFund = getSumBySector("House Fund Commission");
  const executiveOfficer = getSumBySector("Executive Officer Commission");

  // Total points and withdraws
  const points = parseFloat(user?.points) || 0;
  const totalWithdraws = parseFloat(user?.totalwithdraw) || 0;
  const withdrawableBalance = (points - totalWithdraws).toFixed(2);

  let totalTdsValue = 0;
  const tdsRate = await TdsRate.findOne();
  try {
    const tdsRateValue = tdsRate ? tdsRate.tdsValue : 0;
    totalTdsValue = (totalWithdraws * tdsRateValue) / 100;
    await user.save();
  } catch (error) {
    console.error("Error calculating TDS:", error);
    user.totalTDS = 0;
    await user.save();
  }

  return [
    {
      title: "Generation Commission ৳",
      value: (generationCommission * tdsRate?.pointToTaka).toFixed(2),
    },
    {
      title: "Mega Commission ৳",
      value: (megaCommission * tdsRate?.pointToTaka).toFixed(2),
    },
    {
      title: "Refer Commission ৳",
      value: (referCommission * tdsRate?.pointToTaka).toFixed(2),
    },
    {
      title: "Repurchase Commission ৳",
      value: (repurchaseCommission * tdsRate?.pointToTaka).toFixed(2),
    },
    {
      title: "Withdrawable Balance ৳",
      value: (withdrawableBalance * tdsRate?.pointToTaka).toFixed(2),
    },
    {
      title: "Total Withdraw ৳",
      value: (totalWithdraws * tdsRate?.pointToTaka).toFixed(2),
    },
    {
      title: "Total TDS ৳",
      value: totalTdsValue.toFixed(2) * tdsRate?.pointToTaka,
    },
    {
      title: "Executive Officer ৳",
      value: executiveOfficer * tdsRate?.pointToTaka,
    },
    { title: "Special Fund ৳", value: specialFund * tdsRate?.pointToTaka },
    { title: "Car Fund ৳", value: carFund * tdsRate?.pointToTaka },
    { title: "Tour Fund ৳", value: tourFund * tdsRate?.pointToTaka },
    { title: "Home Fund ৳", value: homeFund * tdsRate?.pointToTaka },
  ];
};

// async function buildTree(userId) {
//   const user = await User.findById(userId);
//   if (!user) return null;

//   // 1️⃣ Children load
//   const children = await User.find({
//     $or: [
//       { placementBy: user.referralCode },
//       { referredBy: user.referralCode },
//     ],
//   });

//   const childrenTrees = await Promise.all(
//     children.map((child) => buildTree(child._id))
//   );

//   const leftChild = childrenTrees[0] || null;
//   const rightChild = childrenTrees[1] || null;

//   // 2️⃣ Helper → calculate total grandpoints recursively
//   const calculateTotalGrandPoints = (node) => {
//     if (!node) return 0;
//     let selfGrandPoints = 0;

//     // নিজের AllEntry.incoming → grandpoints যোগ করো
//     if (node.AllEntry && node.AllEntry.incoming && node.AllEntry.incoming.length > 0) {
//       for (const entry of node.AllEntry.incoming) {
//         selfGrandPoints += entry.grandpoints || 0;
//       }
//     }

//     const leftPoints = calculateTotalGrandPoints(node.left);
//     const rightPoints = calculateTotalGrandPoints(node.right);

//     return selfGrandPoints + leftPoints + rightPoints;
//   };

//   // 3️⃣ Grandpoints হিসাব
//   const totalPointsFromLeft = calculateTotalGrandPoints(leftChild);
//   const totalPointsFromRight = calculateTotalGrandPoints(rightChild);

//   // 4️⃣ মাসভিত্তিক হিসাব
//   const getMonthlyIncoming = async (id) => {
//     const u = await User.findById(id);
//     if (!u?.AllEntry?.incoming) return 0;

//     let total = 0;
//     const now = new Date();

//     for (const entry of u.AllEntry.incoming) {
//       const entryDate = new Date(entry.date);
//       if (
//         entryDate.getMonth() === now.getMonth() &&
//         entryDate.getFullYear() === now.getFullYear()
//       ) {
//         total += entry.grandpoints;
//       }
//     }
//     return total;
//   };

//   const previousgetMonthlyIncoming = async (id) => {
//     const u = await User.findById(id);
//     if (!u?.AllEntry?.incoming) return 0;

//     let total = 0;
//     const now = new Date();
//     const previousMonth = new Date(now);
//     previousMonth.setMonth(now.getMonth() - 1);

//     for (const entry of u.AllEntry.incoming) {
//       const entryDate = new Date(entry.date);
//       if (
//         entryDate.getMonth() === previousMonth.getMonth() &&
//         entryDate.getFullYear() === previousMonth.getFullYear()
//       ) {
//         total += entry.grandpoints;
//       }
//     }
//     return total;
//   };

//   // 5️⃣ শুধুমাত্র এক লেভেল left/right এর monthly BV
//   const monthlyleftBV = leftChild ? await getMonthlyIncoming(leftChild._id) : 0;
//   const monthlyrightBV = rightChild ? await getMonthlyIncoming(rightChild._id) : 0;
//   const previousmonthlyleftBV = leftChild ? await previousgetMonthlyIncoming(leftChild._id) : 0;
//   const previousmonthlyrightBV = rightChild ? await previousgetMonthlyIncoming(rightChild._id) : 0;

//   // 6️⃣ Return
//   return {
//     name: user.name,
//     _id: user._id,
//     Position: user.Position,
//     phone: user.phone,
//     referralCode: user.referralCode,
//     referredBy: user.referredBy,
//     placementBy: user.placementBy,
//     status: user.isActivePackage,
//     points: user.points || 0,
//     AllEntry: user.AllEntry || {},
//     left: leftChild,
//     right: rightChild,
//     monthlyleftBV,
//     monthlyrightBV,
//     totalPointsFromLeft,
//     totalPointsFromRight,
//     previousmonthlyrightBV,
//     previousmonthlyleftBV,
//   };
// }

async function buildTree(userId) {
  const user = await User.findById(userId);
  if (!user) return null;

  // 1) Children load
  const children = await User.find({
    $or: [
      { placementBy: user.referralCode },
      { referredBy: user.referralCode },
    ],
  });

  const childrenTrees = await Promise.all(
    children.map((child) => buildTree(child._id))
  );

  const leftChild = childrenTrees[0] || null;
  const rightChild = childrenTrees[1] || null;

  //-------------------------------
  // HELPER 1: Collect ALL IDs from subtree
  //-------------------------------
  const collectIds = (node, list = []) => {
    if (!node) return list;
    list.push(node._id.toString());
    collectIds(node.left, list);
    collectIds(node.right, list);
    return list;
  };

  const leftIds = collectIds(leftChild);   // ALL left subtree users
  const rightIds = collectIds(rightChild); // ALL right subtree users


  //-------------------------------
  // HELPER 2: Get all incoming points for a list of IDs
  //-------------------------------
  const sumIncomingForUsers = async (ids) => {
    if (ids.length === 0) return 0;

    const users = await User.find({ _id: { $in: ids } });
    // console.log(`Calculating sum for ${ids.length} users`);

    let total = 0;
    for (const u of users) {
      if (!u?.AllEntry?.incoming) continue;
      for (const entry of u.AllEntry.incoming) {
        total += Number(entry.grandpoints || 0);
        // console.log(`Adding ${entry.grandpoints} from user ${u.name}`);
      }
    }
    return total;
  };

  //-------------------------------
  // MONTHLY incoming for only first level child
  //-------------------------------
  const getMonthlyIncoming = async (id) => {
    const u = await User.findById(id);
    if (!u?.AllEntry?.incoming) return 0;

    let total = 0;
    const now = new Date();

    for (const entry of u.AllEntry.incoming) {
      const entryDate = new Date(entry.date);
      if (
        entryDate.getMonth() === now.getMonth() &&
        entryDate.getFullYear() === now.getFullYear()
      ) {
        total += entry.grandpoints;
      }
    }
    return total;
  };

  //--------------------------------------
// HELPER: Monthly incoming for a list of IDs (FULL SUBTREE)
//--------------------------------------
const sumMonthlyIncomingForUsers = async (ids) => {
  if (ids.length === 0) return 0;

  const now = new Date();
  const users = await User.find({ _id: { $in: ids } });

  let total = 0;

  for (const u of users) {
    if (!u?.AllEntry?.incoming) continue;

    for (const entry of u.AllEntry.incoming) {
      const date = new Date(entry.date);

      if (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        total += Number(entry.grandpoints || 0);
      }
    }
  }

  return total;
};
//--------------------------------------
// HELPER: Previous month incoming for FULL subtree
//--------------------------------------
const sumPreviousMonthIncomingForUsers = async (ids) => {
  if (ids.length === 0) return 0;

  const now = new Date();
  const currentMonth = now.getMonth();      // 0-11
  const currentYear = now.getFullYear();

  // previous month calculation
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const users = await User.find({ _id: { $in: ids } });

  let total = 0;

  for (const u of users) {
    if (!u?.AllEntry?.incoming) continue;

    for (const entry of u.AllEntry.incoming) {
      const date = new Date(entry.date);

      if (
        date.getMonth() === previousMonth &&
        date.getFullYear() === previousMonthYear
      ) {
        total += Number(entry.grandpoints || 0);
      }
    }
  }

  return total;
};
const previousMonthlyLeftSubtreeBV =
  await sumPreviousMonthIncomingForUsers(leftIds);

const previousMonthlyRightSubtreeBV =
  await sumPreviousMonthIncomingForUsers(rightIds);



  // const monthlyleftBV = leftChild ? await getMonthlyIncoming(leftChild._id) : 0;
  // const monthlyrightBV = rightChild ? await getMonthlyIncoming(rightChild._id) : 0;
  const monthlyleftBV = leftChild ? await sumMonthlyIncomingForUsers(leftIds) : 0;
  const monthlyrightBV = rightChild ? await sumMonthlyIncomingForUsers(rightIds) : 0;


  //-------------------------------
  // ⭐ NEW LOGIC: FULL SUBTREE POINTS
  //-------------------------------
  const totalPointsFromLeft = await sumIncomingForUsers(leftIds);
  const totalPointsFromRight = await sumIncomingForUsers(rightIds);

  // console.log("LEFT IDS:", leftIds);
  // console.log("RIGHT IDS:", rightIds);
  // console.log(`User ${user.name} → LEFT Total Points = ${totalPointsFromLeft}, RIGHT Total Points = ${totalPointsFromRight}`);

  return {
    name: user.name,
    _id: user._id,
    Position: user.Position,
    phone: user.phone,
    referralCode: user.referralCode,
    referredBy: user.referredBy,
    placementBy: user.placementBy,
    points: user.points || 0,
    left: leftChild,
    right: rightChild,
    monthlyleftBV,
    monthlyrightBV,
    totalPointsFromLeft,
    totalPointsFromRight,
     // ⭐ FULL subtree previous month total (NEW)
  previousMonthlyLeftSubtreeBV,
  previousMonthlyRightSubtreeBV,
    leftIds,   // optional: useful for debugging
    rightIds,
  };
}





// const positionLevelsforRanks = [
//   {
//     rank: 1,
//     leftBV: 15000,
//     rightBV: 15000,
//     position: "Executive Officer",
//     generationLevel: 10,
//     megaGenerationLevel: 3,
//   },
//   {
//     rank: 2,
//     leftBV: 30000,
//     rightBV: 30000,
//     position: "Executive Manager",
//     generationLevel: 15,
//     megaGenerationLevel: 3,
//   },
//   {
//     rank: 3,
//     leftBV: 60000,
//     rightBV: 60000,
//     position: "Executive Director",
//     generationLevel: 20,
//     megaGenerationLevel: 4,
//   },
//   {
//     rank: 4,
//     leftBV: 150000,
//     rightBV: 150000,
//     position: "Diamond Director",
//     generationLevel: 20,
//     megaGenerationLevel: 4,
//   },
//   {
//     rank: 5,
//     leftBV: 300000,
//     rightBV: 300000,
//     position: "Crown Director",
//     generationLevel: 999999,
//     megaGenerationLevel: 999999,
//   },
// ];

const positionLevels = [
  {
    rank: 1,
    leftPV: 5,
    rightPV: 5,
    leftBV: 30000,
    rightBV: 30000,
    position: "Executive Officer",
    reward: "Frying Pan",
    generationLevel: 10,
    megaGenerationLevel: 3,
  },
  {
    rank: 2,
    leftPV: 15,
    rightPV: 15,
    leftBV: 90000,
    rightBV: 90000,
    position: "Executive Manager",
    reward: "Rice Cooker",
    generationLevel: 15,
    megaGenerationLevel: 3,
  },
  {
    rank: 3,
    leftPV: 50,
    rightPV: 50,
    leftBV: 300000,
    rightBV: 300000,
    position: "Executive Director",
    reward: "Inani Tour or ৳10,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 4,
    leftPV: 120,
    rightPV: 120,
    leftBV: 720000,
    rightBV: 720000,
    position: "Executive Pal Director",
    reward: "Cox’s Bazar Tour",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 5,
    leftPV: 220,
    rightPV: 220,
    leftBV: 1320000,
    rightBV: 1320000,
    position: "Executive Total Director",
    reward: "Laptop or ৳30,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 6,
    leftPV: 500,
    rightPV: 500,
    leftBV: 3000000,
    rightBV: 3000000,
    position: "Executive Emerald",
    reward: "Bike or ৳50,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 7,
    leftPV: 1000,
    rightPV: 1000,
    leftBV: 6000000,
    rightBV: 6000000,
    position: "Executive Elite",
    reward: "Thailand Tour or ৳1,25,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 8,
    leftPV: 2000,
    rightPV: 2000,
    leftBV: 12000000,
    rightBV: 12000000,
    position: "Executive Deluxe",
    reward: "Hajj/Umrah or ৳3,00,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 9,
    leftPV: 4000,
    rightPV: 4000,
    leftBV: 24000000,
    rightBV: 24000000,
    position: "Executive Marjury",
    reward: "Car or ৳6,00,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 10,
    leftPV: 8000,
    rightPV: 8000,
    leftBV: 48000000,
    rightBV: 48000000,
    position: "Diamond Director",
    reward: "Car or ৳13,00,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 11,
    leftPV: 16000,
    rightPV: 16000,
    leftBV: 96000000,
    rightBV: 96000000,
    position: "Double Diamond",
    reward: "Private Car or ৳25,00,000 cash",
    generationLevel: Infinity, // From PDF: Unlimited
    megaGenerationLevel: Infinity,
  },
  {
    rank: 12,
    leftPV: 24000,
    rightPV: 24000,
    leftBV: 144000000,
    rightBV: 144000000,
    position: "Crown Director",
    reward: "৳50,00,000 cash",
    generationLevel: Infinity,
    megaGenerationLevel: Infinity,
  },
  {
    rank: 13,
    leftPV: 37000,
    rightPV: 37000,
    leftBV: 222000000,
    rightBV: 222000000,
    position: "Star Crown",
    reward: "Mansion or ৳1 crore cash",
    generationLevel: Infinity,
    megaGenerationLevel: Infinity,
  },
  {
    rank: 14,
    leftPV: 50000,
    rightPV: 50000,
    leftBV: 300000000,
    rightBV: 300000000,
    position: "Universal Crown",
    reward: "৳5 crore cash or Villa",
    generationLevel: Infinity,
    megaGenerationLevel: Infinity,
  },
];

const UpdateRanksAndRewards = async (buyer) => {
  try {
    const tree = await buildTree(buyer._id);
    if (!tree) return;

    const leftBV = Number(tree?.totalPointsFromLeft || 0);
    const rightBV = Number(tree?.totalPointsFromRight || 0);


    // console.log("Left Tree:", tree);
    // console.log("Right Tree:", rightBV);
    const matchedRank = positionLevels
      .slice()
      .reverse()
      .find((level) => leftBV >= level.leftBV && rightBV >= level.rightBV);

    // console.log("Matched Rank:", matchedRank);


    if (!matchedRank) return;

    const user = await User.findById(buyer._id);
    // console.log("User Current Position:", user?.Position);

    // // Update if new position is higher than existing
    const currentRankIndex = positionLevels.findIndex(
      (r) => r.position === user.Position
    );
    const newRankIndex = positionLevels.findIndex(
      (r) => r.position === matchedRank.position
    );

    // console.log("Current Rank Index:", currentRankIndex);
    // console.log("New Rank Index:", newRankIndex);

    if (newRankIndex > currentRankIndex) {
      // console.log(`🔄 Upgrading user ${user._id} from ${user.Position} to ${matchedRank.position}`);
      // user.Position = matchedRank.position;
      user.RewardPosition = matchedRank.position;
      user.rewards = matchedRank.reward;
      user.GenerationLevel = matchedRank.generationLevel;
      user.MegaGenerationLevel = matchedRank.megaGenerationLevel;
      // if (user.isActivePackage === "expire" || user.isActivePackage === "In Active") {
      // user.isActivePackage = "active";
      // 30 din er expire date
      // const expireDate = new Date();
      // expireDate.setDate(expireDate.getDate() + 30);
      // user.packageExpireDate = expireDate;

      // console.log(`✅ User ${user._id} re-activated. New expire date: ${user.packageExpireDate}`);
      // }

      if (!user.rewards?.includes(matchedRank?.reward)) {
        user.rewards = Array.isArray(user.rewards)
          ? [...user.rewards, matchedRank.reward]
          : [matchedRank.reward];

      }

      await user.save();

      // console.log("✅ Ready to post rank upgrade...");


      // Save to RankUpgradeRequest
      const postrank = await RankUpgradeRequest.create({
        userId: user._id,
        name: user.name,
        phone: user.phone,
        previousPosition: positionLevels[currentRankIndex]?.position || null,
        newPosition: matchedRank.position,
        reward: matchedRank.reward,
        leftBV,
        rightBV,
        status: "pending",
      });

      // console.log("Rank upgrade request created:", postrank);
      // console.log(
      //   `✅ Rank upgrade request saved for ${user.name} to ${matchedRank.position}`
      // );
      // console.log(
      //   `✅ User ${user._id} upgraded to ${matchedRank.position} with reward: ${matchedRank.reward}`
      // );
    }
  } catch (error) {
    console.error("❌ Error updating ranks and rewards:", error);
  }
};
// const UpdateRanks = async (buyer) => {
//   try {
//     const tree = await buildTree(buyer._id);
//     if (!tree) return;

//     const leftBV = tree.monthlyleftBV;
//     const rightBV = tree.monthlyrightBV;

//     console.log("Left Tree:", leftBV);
//     console.log("Right Tree:", rightBV);

//     const matchedRank = positionLevelsforRanks
//       .slice()
//       .reverse()
//       .find((level) => leftBV >= level.leftBV && rightBV >= level.rightBV);
//     // console.log("Matched Rank:", matchedRank);

//     if (!matchedRank) return;

//     const user = await User.findById(buyer._id);

//     // // Update if new position is higher than existing
//     const currentRankIndex = positionLevelsforRanks.findIndex(
//       (r) => r.position === user.Position
//     );
//     const newRankIndex = positionLevelsforRanks.findIndex(
//       (r) => r.position === matchedRank.position
//     );

//     if (newRankIndex > currentRankIndex) {
//       user.Position = matchedRank.position;
//       user.GenerationLevel = matchedRank.generationLevel;
//       user.MegaGenerationLevel = matchedRank.megaGenerationLevel;
//       // if (user.isActivePackage === "expire" || user.isActivePackage === "In Active") {
//         // user.isActivePackage = "active";
//         // 30 din er expire date
//         // const expireDate = new Date();
//         // expireDate.setDate(expireDate.getDate() + 30);
//         // user.packageExpireDate = expireDate;

//         // console.log(`✅ User ${user._id} re-activated. New expire date: ${user.packageExpireDate}`);
//       // }
//       await user.save();
//     }
//   } catch (error) {
//     console.error("❌ Error updating ranks and rewards:", error);
//   }
// };

const PackageLevels = [
  {
    rank: 1,
    pointsBV: 1000,
    Package: "Friend",
    generationLevel: 3,
    megaGenerationLevel: 0,
  },
  {
    rank: 2,
    pointsBV: 2500,
    Package: "Family",
    generationLevel: 5,
    megaGenerationLevel: 1,
  },
  {
    rank: 3,
    pointsBV: 7500,
    Package: "Bussiness Relative",
    generationLevel: 7,
    megaGenerationLevel: 2,
  },
  {
    rank: 1,
    pointsBV: 17500,
    Package: "Bussiness Relation",
    generationLevel: 10,
    megaGenerationLevel: 3,
  },
];

const PackageLevelsdefine = async (buyer) => {
  // console.log("PackageLevelsdefine called for buyer:", buyer._id);
  try {
    const matchedRank = PackageLevels.slice()
      .reverse()
      .find((level) => buyer.points >= level.pointsBV);
    // console.log("Matched Rank:", matchedRank);

    buyer.package = matchedRank.Package;
    buyer.GenerationLevel = matchedRank.generationLevel;
    buyer.MegaGenerationLevel = matchedRank.megaGenerationLevel;
    buyer.isActivePackage = "active";
    await buyer.save();

    // console.log(`✅ User ${buyer._id} package updated to `, buyer);
  } catch (error) {
    console.error("❌ Error in PackageLevelsdefine:", error);
  }
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

    const summary = await generateUserSummary(user, referredUsers);

    const tree = await buildTree(user._id);
    const leftPoints = tree?.monthlyleftBV || 0;
    const rightPoints = tree?.monthlyrightBV || 0;
    if (leftPoints >= 30000 && rightPoints >= 30000) {
      await UpdateRanksAndRewards(user);
    }

    // const leftmonthlyBV = tree?.monthlyleftBV || 0;
    // const rightmonthlyBV = tree?.monthlyrightBV || 0;
    // if (leftmonthlyBV >= 15000 && rightmonthlyBV >= 15000) {
    //   await UpdateRanks(user);
    // }
    // else {
    //   // ✅ Otherwise run package-level fallback logic
    //   await PackageLevelsdefine(user);
    // }

    // *****************************************************************

    res.status(200).json({
      success: true,
      userId: user._id,
      name: user.name,
      email: user.email,
      summary: summary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
const userStatements = async (req, res) => {
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

    const summary = await generateUserSummaryStatements(user, referredUsers);

    // *****************************************************************

    res.status(200).json({
      success: true,
      userId: user._id,
      name: user.name,
      email: user.email,
      summary: summary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
const userAllStatements = async (req, res) => {
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

    const summary = await generateUserSummaryCommissionStatements(
      user,
      referredUsers
    );

    // *****************************************************************

    res.status(200).json({
      success: true,
      userId: user._id,
      name: user.name,
      email: user.email,
      summary: summary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

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
  getReferralTreeById,
  userStatements,
  userAllStatements,
  buildTree,
};
