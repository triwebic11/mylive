const User = require("../models/User");
const PackageRequest = require("../models/PackageRequest");
const PackagesModel = require("../models/PackagesModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password, referralCode } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newReferralCode = await generateReferralCode();

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

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referralCode || null,
      referralTree,
    });

    // Reward system – Add points to 10 uplines
    // if (referralTree.length > 0) {
    //   for (let i = 0; i < referralTree.length; i = 10) {
    //     const uplineId = referralTree[i];
    //     const point = 100 - i;

    //     await User.findByIdAndUpdate(uplineId, {
    //       $inc: { points: point },
    //     });
    //   }
    // }

    // ধরলাম newUser হচ্ছে যিনি register করলেন
    if (referralTree.length > 0) {
      // STEP 1: নতুন user এর package info বের করো
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
        console.log("❌ Child user's package PV not found");
        return;
      }

      // STEP 2: Loop through all uplines
      for (let i = 0; i < referralTree.length; i++) {
        const uplineId = referralTree[i];
        if (!uplineId) break;

        // STEP 3: প্রতিটি upline user এর package details বের করো
        const uplinePackageReq = await PackageRequest.findOne({
          userId: uplineId,
        });
        const uplinePackageName = uplinePackageReq?.packageName;

        const uplinePackageModel = await PackagesModel.findOne({
          name: uplinePackageName,
        });
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

        if (!uplineGenerations) {
          console.log(`⛔ Invalid or missing package for upline: ${uplineId}`);
          continue;
        }

        // STEP 4: Check if this upline is eligible for this generation
        if (i < uplineGenerations) {
          const point = childStartPoint - i * childDecreasePV;

          if (point > 0) {
            await User.findByIdAndUpdate(uplineId, {
              $inc: { points: point },
            });

            console.log(
              `✅ Upline ${uplineId} got ${point} points from generation ${
                i + 1
              } based on child package`
            );
          } else {
            console.log(`⚠️ Point is 0 or less for upline ${uplineId}`);
          }
        } else {
          console.log(
            `⛔ Upline ${uplineId} not eligible for generation ${i + 1}`
          );
        }
      }
    }

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
      referralCode: newReferralCode,
      referralTree,
      points: newUser.points,
    });
  } catch (error) {
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

  try {
    const updatedRole = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({
      message: "Role updated successfully",
      product: updatedRole,
    });
  } catch (error) {
    console.error("Patch update failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Optional utility to generate summary from user
const generateUserSummary = (user) => {
  const outgoing = user.AllEntry?.outgoing || [];

  const getSumBySector = (sectorName) => {
    return outgoing
      .filter((entry) => entry.sector === sectorName)
      .reduce((sum, entry) => sum + (entry.pointGiven || 0), 0);
  };

  const productPurchasePoints = getSumBySector("ProductPurchase");
  const referCommission = getSumBySector("ReferCommission");
  const generationCommission = getSumBySector("GenerationCommission");
  const megaCommission = getSumBySector("MegaCommission");
  const repurchaseSponsorBonus = getSumBySector("RepurchaseSponsorBonus");
  const repurchaseCommission = getSumBySector("RepurchaseCommission");
  const specialFund = getSumBySector("SpecialFund");
  const withdrawableBalance = getSumBySector("Withdrawable");
  const totalWithdraw = getSumBySector("Withdraw");
  const totalTDS = getSumBySector("TDS");

  return [
    { title: "Total Refer", value: user.referralTree?.length || 0 },
    { title: "Total Free Team", value: 0 },
    { title: "Total Active Team", value: 0 },
    {
      title: "Currently Expired",
      value: new Date(user.packageExpireDate) < new Date() ? 1 : 0,
    },
    { title: "Total Voucher", value: 0 },
    { title: "Previous Month Pv", value: 0 },
    {
      title: "Current Month Pv",
      value:
        user.TargetPV?.reduce((sum, pv) => sum + (pv.currentMonthPV || 0), 0) ||
        0,
    },
    { title: "Monthly down sale pv", value: 0 },
    { title: "Total Team Sale Pv", value: 0 },
    { title: "Total Team Member", value: user.referralTree?.length || 0 },
    { title: "Current Purchase Amount", value: 0 },
    { title: "Total Purchase Amount", value: 0 },
    { title: "Total Purchase Pv", value: productPurchasePoints },
    { title: "Refer Commission", value: referCommission },
    { title: "Generation Commission", value: generationCommission },
    { title: "Mega Commission", value: megaCommission },
    { title: "Repurchase Sponsor Bonus", value: repurchaseSponsorBonus },
    { title: "Special Fund", value: specialFund },
    { title: "Withdrawable Balance", value: withdrawableBalance },
    { title: "Total Withdraw", value: totalWithdraw },
    { title: "Repurchase Commission", value: repurchaseCommission },
    { title: "Total TDS", value: totalTDS },
    { title: "Car Fund", value: 0 },
    { title: "Special Fund", value: 0 },
    { title: "Tour Fund", value: 0 },
    { title: "Home Fund", value: 0 },
  ];
};

const userAgregateData = async (req, res) => {
  try {
    const { id } = req.params; // or req.body.id
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const summary = generateUserSummary(user);

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
};
