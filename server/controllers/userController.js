const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Referral Code Generator
const generateReferralCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = Math.random().toString(36).substring(2, 10).toUpperCase(); // 6-digit
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
    if (referralTree.length > 0) {
      for (let i = 0; i < referralTree.length; i++) {
        const uplineId = referralTree[i];
        const point = 10 - i; // Level 1 gets 10, Level 2 gets 9, ..., Level 10 gets 1

        await User.findByIdAndUpdate(uplineId, {
          $inc: { points: point },
        });
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

module.exports = {
  registerUser,
  loginUser,
  getMyReferrals,
  getReferralTreeDetails,
  getMyAllReferrals,
  updateUserPassword,
  getAllUsers,
  getUserById,
};

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // ➤ Helper to generate a short refer ID
// const generateReferId = (name) => {
//   const random = Math.floor(100 + Math.random() * 900);
//   return name.slice(0, 3).toUpperCase() + random;
// };

// // ➤ Helper to generate a user ID
// const generateUserId = () => {
//   return "USR" + Math.floor(1000 + Math.random() * 9000);
// };

// // 🔁 Recursively update referral data up to 20 generations
// const updateReferralTree = async (userId, referrerId, generation = 1) => {
//   if (!referrerId || generation > 20) return;

//   const referrer = await User.findById(referrerId);
//   if (!referrer) return;

//   // Push this referral info to the referrer's referData array
//   referrer.referData.push({
//     generation,
//     referredUser: userId,
//   });

//   await referrer.save();

//   // Recurse to next generation if the referrer also has a referrer
//   if (referrer.referredBy) {
//     await updateReferralTree(userId, referrer.referredBy, generation + 1);
//   }
// };

// // 🔐 Register a user
// const registerUser = async (req, res) => {
//   try {
//     const {
//       phone,
//       name,
//       password,
//       referrerId,
//       role = "user",
//       ...otherFields
//     } = req.body;

//     const existing = await User.findOne({ phone });
//     if (existing) {
//       return res.status(400).json({ message: "Phone Number already exists" });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     // Generate unique referral code
//     const generateReferralCode = async () => {
//       let code;
//       let isUnique = false;
//       while (!isUnique) {
//         code = Math.random().toString(36).substring(2, 10).toUpperCase();
//         const existingCode = await User.findOne({ referralCode: code });
//         if (!existingCode) isUnique = true;
//       }
//       return code;
//     };

//     const referralCode = await generateReferralCode();

//     // Handle referrer logic
//     let referredBy = null;

//     if (referrerId && referrerId.trim() !== "") {
//       const referrer = await User.findOne({ referralCode: referrerId });
//       if (referrer) {
//         referredBy = referrer._id;
//       }
//     }

//     // Create user object
//     const newUser = new User({
//       phone,
//       name,
//       password: hashed,
//       role,
//       referralCode,
//       referredBy,
//       ...otherFields,

//       userId: generateUserId(),
//       referId: generateReferId(name),
//       package: "Friend",
//       packagePV: 1000,
//       packageAmount: 2000,
//       accountStatus: "",
//       totalPV: 0,
//       totalAmount: 0,
//       referData: [],
//       allEntries: [],
//     });

//     await newUser.save();

//     // ➤ Update 20-generation referral tree
//     if (referredBy) {
//       await updateReferralTree(newUser._id, referredBy);
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       { id: newUser._id, phone: newUser.phone, role: newUser.role },
//       process.env.JWT_SECRET || "your_jwt_secret_key",
//       { expiresIn: "20d" }
//     );

//     res.status(201).json({
//       message: "User registered successfully",
//       user: newUser,
//       token,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // 🔑 Login user
// const loginUser = async (req, res) => {
//   try {
//     const { phone, password } = req.body;

//     const user = await User.findOne({ phone });
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ message: "Incorrect password" });
//     }

//     const token = jwt.sign(
//       { id: user._id, phone: user.phone, role: user.role },
//       process.env.JWT_SECRET || "your_jwt_secret_key",
//       { expiresIn: "7d" }
//     );

//     res.status(201).json({
//       message: "User registered successfully",
//       user: user,
//       token,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// const getMyReferrals = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     const user = await User.findById(userId).populate({
//       path: "referData.referredUser",
//       select: "name phone referralCode",
//     });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json({
//       referrals: user.referData,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch referrals" });
//   }
// };

// // 👥 Get all users
// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find({}, { password: 0, __v: 0 });
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch users" });
//   }
// };

// // users: full user list (from DB or JSON)
// async function getReferralTree(referId, users, level = 1) {
//   const direct = users.filter((user) => user.referredBy === referId);

//   let tree = [];

//   for (const user of direct) {
//     tree.push({
//       ...user,
//       level,
//     });

//     const children = await getReferralTree(user.referId, users, level + 1);
//     tree = tree.concat(children);
//   }

//   return tree;
// }

// // get user by refer id

// // router.get("/referrals/:referId", async (req, res) => {
// //   try {
// //     const { referId } = req.params;

// //     // Find all users whose referredBy matches this referId
// //     const referrals = await User.find({ referredBy: referId });

// //     res.status(200).json({
// //       success: true,
// //       message: `Found ${referrals.length} referrals`,
// //       referrals,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching referrals:", error);
// //     res.status(500).json({ success: false, message: "Server error", error: error.message });
// //   }
// // });

// const getdatafromReferId = async (req, res) => {
//   try {
//     const { referId } = req.params;
//     const users = await User.find();

//     const downlineTree = await getReferralTree(referId, users);
//     res.status(200).json({
//       message: `Found ${downlineTree.length} downlines`,
//       data: downlineTree,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// //All users list

// const getMyAllReferrals = async (req, res) => {
//   try {
//     const users = await User.find();

//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// //getReferralTreeDetails

// const getReferralTreeDetails = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     const users = await User.find({ _id: { $in: ids } }).select(
//       "_id name email"
//     );

//     // preserve original order
//     const orderedUsers = ids.map((id) =>
//       users.find((u) => u._id.toString() === id)
//     );

//     res.status(200).json(orderedUsers);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// module.exports = { registerUser, loginUser, getUsers, getdatafromReferId,getMyAllReferrals, getMyReferrals, getReferralTreeDetails };
