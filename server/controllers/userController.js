const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ➤ Helper to generate a short refer ID
const generateReferId = (name) => {
  const random = Math.floor(100 + Math.random() * 900);
  return name.slice(0, 3).toUpperCase() + random;
};

// ➤ Helper to generate a user ID
const generateUserId = () => {
  return "USR" + Math.floor(1000 + Math.random() * 9000);
};

// 🔁 Recursively update referral data up to 20 generations
const updateReferralTree = async (userId, referrerId, generation = 1) => {
  if (!referrerId || generation > 20) return;

  const referrer = await User.findById(referrerId);
  if (!referrer) return;

  // Push this referral info to the referrer's referData array
  referrer.referData.push({
    generation,
    referredUser: userId,
  });

  await referrer.save();

  // Recurse to next generation if the referrer also has a referrer
  if (referrer.referredBy) {
    await updateReferralTree(userId, referrer.referredBy, generation + 1);
  }
};

// 🔐 Register a user
const registerUser = async (req, res) => {
  try {
    const {
      phone,
      name,
      password,
      referrerId,
      role = "user",
      ...otherFields
    } = req.body;

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "Phone Number already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Generate unique referral code
    const generateReferralCode = async () => {
      let code;
      let isUnique = false;
      while (!isUnique) {
        code = Math.random().toString(36).substring(2, 10).toUpperCase();
        const existingCode = await User.findOne({ referralCode: code });
        if (!existingCode) isUnique = true;
      }
      return code;
    };

    const referralCode = await generateReferralCode();

    // Handle referrer logic
    let referredBy = null;
    referrerId = req.body.referrerId;
    if (referrerId) {
      const referrer = await User.findOne({ referralCode: referrerId });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    // Create user object
    const newUser = new User({
      phone,
      name,
      password: hashed,
      role,
      referralCode,
      referredBy,
      ...otherFields,

      userId: generateUserId(),
      referId: generateReferId(name),
      package: "Friend",
      packagePV: 1000,
      packageAmount: 2000,
      accountStatus: "",
      totalPV: 0,
      totalAmount: 0,
      referData: [],
      allEntries: [],
    });

    await newUser.save();

    // ➤ Update 20-generation referral tree
    if (referredBy) {
      await updateReferralTree(newUser._id, referredBy);
    }

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, phone: newUser.phone, role: newUser.role },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "20d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔑 Login user
const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: user,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getMyReferrals = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate({
      path: "referData.referredUser",
      select: "name phone referralCode",
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      referrals: user.referData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch referrals" });
  }
};

// 👥 Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// users: full user list (from DB or JSON)
async function getReferralTree(referId, users, level = 1) {
  const direct = users.filter((user) => user.referredBy === referId);

  let tree = [];

  for (const user of direct) {
    tree.push({
      ...user,
      level,
    });

    const children = await getReferralTree(user.referId, users, level + 1);
    tree = tree.concat(children);
  }

  return tree;
}

// get user by refer id

// router.get("/referrals/:referId", async (req, res) => {
//   try {
//     const { referId } = req.params;

//     // Find all users whose referredBy matches this referId
//     const referrals = await User.find({ referredBy: referId });

//     res.status(200).json({
//       success: true,
//       message: `Found ${referrals.length} referrals`,
//       referrals,
//     });
//   } catch (error) {
//     console.error("Error fetching referrals:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// });

const getdatafromReferId = async (req, res) => {
  try {
    const { referId } = req.params;
    const users = await User.find();

    const downlineTree = await getReferralTree(referId, users);
    res.status(200).json({
      message: `Found ${downlineTree.length} downlines`,
      data: downlineTree,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { registerUser, loginUser, getUsers, getdatafromReferId };
