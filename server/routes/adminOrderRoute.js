const express = require("express");
const router = express.Router();
const AdminOrder = require("../models/AdminOrder");
const User = require("../models/User");


async function buildTree(userId) {
  console.log("Building tree for user:", userId);
  const user = await User.findById(userId);
  if (!user) return null;

  console.log("Building tree for user:", user.name);

  // 🔍 Find users who have this user's referral code in either placementBy or referredBy
  const children = await User.find({
    $or: [
      { placementBy: user.referralCode },
      { referredBy: user.referralCode },
    ]
  });

  console.log("Children found:", children.length);

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

// const getReferralTreeById = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const tree = await buildTree(userId);
//     console.log("Referral Tree for:", userId);
//     res.json(tree);
//   } catch (err) {
//     console.error("Tree build error:", err);
//     res.status(500).json({ error: "Failed to fetch referral tree" });
//   }
// };


// 🌲 Downline Tree Build
async function buildTree(userId) {
  const user = await User.findById(userId);
  if (!user) return null;

  const children = await User.find({
    $or: [
      { placementBy: user.referralCode },
      { referredBy: user.referralCode }
    ]
  });

  const childrenTrees = await Promise.all(
    children.map(child => buildTree(child._id))
  );

  return {
    name: user.name,
    _id: user._id,
    Position: user.Position,
    phone: user.phone,
    referralCode: user.referralCode,
    referredBy: user.referredBy,
    placementBy: user.placementBy,
    left: childrenTrees[0] || null,
    right: childrenTrees[1] || null,
  };
}

// 🔼 Upline Tree Build
async function buildUplineTree(userId, depth = 1, maxDepth = 10, visited = new Set()) {
  if (depth > maxDepth) return null;

  const user = await User.findById(userId);
  if (!user || visited.has(user._id.toString())) return null;

  visited.add(user._id.toString());

  const parent = await User.findOne({
    $or: [
      { referralCode: user.referredBy },
      { referralCode: user.placementBy }
    ]
  });

  const parentTree = parent
    ? await buildUplineTree(parent._id, depth + 1, maxDepth, visited)
    : null;

  return {
    name: user.name,
    _id: user._id,
    phone: user.phone,
    referralCode: user.referralCode,
    referredBy: user.referredBy,
    placementBy: user.placementBy,
    GenerationLevel: user.GenerationLevel ?? 0,
    child: parentTree
  };
}

function flattenUplineTree(tree, level = 1, result = []) {
  if (!tree) return result;
  result.push({ ...tree, level });
  return flattenUplineTree(tree.child, level + 1, result);
}

function isBuyerInTree(tree, buyerId, currentDepth = 1, maxDepth = 10) {
  if (!tree || currentDepth > maxDepth) return false;
  if (tree._id.toString() === buyerId.toString()) return true;

  return (
    isBuyerInTree(tree.left, buyerId, currentDepth + 1, maxDepth) ||
    isBuyerInTree(tree.right, buyerId, currentDepth + 1, maxDepth)
  );
}


const distributeGrandPoint = async (buyerId, grandPoint, buyerphone, grandTotalPrice) => {
  // const buyer = await User.findById(buyerId);
  const buyer = await User.findOne({ phone: buyerphone });
  if (!buyer) return;

  console.log("Distributing grand points for buyer(je product kinlo):", buyer);

  const tenPercent = grandPoint * 0.10;
  const thirtyPercent = grandPoint * 0.30;
  const twentyPercent = grandPoint * 0.20;


  const uplineTree = await buildUplineTree(buyer._id);
  const flatUplines = flattenUplineTree(uplineTree);
  const maxLevel = 10;
  const pointPerLevel = thirtyPercent / maxLevel;

  for (const upline of flatUplines) {
    const uplineSubtree = await buildTree(upline._id);
    const found = isBuyerInTree(uplineSubtree, buyer._id, 1, upline.GenerationLevel);
    // console.log("upline user", upline )
    if (found && upline.GenerationLevel >= upline.level) {
      const uplineUser = await User.findById(upline._id);
      console.log("upline users", uplineUser.name, "Level:", upline.level);
      uplineUser.points = (uplineUser.points || 0) + pointPerLevel;
      uplineUser.AllEntry = uplineUser.AllEntry || { incoming: [], outgoing: [] };
      uplineUser.AllEntry.incoming.push({
        fromUser: buyer._id,
        pointReceived: pointPerLevel,
        sector: `Level ${upline.level} generation commission`,
        date: new Date()
      });
      await uplineUser.save();
    }
  }




// 1. Build the Upline Tree
async function buildUplineTree(userId, depth = 0, maxDepth = 10, visited = new Set()) {
  if (depth > maxDepth) return null;

  const user = await User.findById(userId);
  if (!user || visited.has(user._id.toString())) return null;

  visited.add(user._id.toString());

  // Try to find the parent using referral or placement code
  const query = [];
  if (user.referredBy) query.push({ referralCode: user.referredBy });
  if (user.placementBy) query.push({ referralCode: user.placementBy });

  const parent = await User.findOne({ $or: query });

  // If no parent, return only the current user
  if (!parent) {
    return {
      name: user.name,
      _id: user._id,
      phone: user.phone,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      placementBy: user.placementBy,
      GenerationLevel: user.GenerationLevel ?? 0,
      child: null,
    };
  }

  // Recursively build the tree upward
  const parentTree = await buildUplineTree(parent._id, depth + 1, maxDepth, visited);

  return {
    name: user.name,
    _id: user._id,
    phone: user.phone,
    referralCode: user.referralCode,
    referredBy: user.referredBy,
    placementBy: user.placementBy,
    GenerationLevel: user.GenerationLevel ?? 0,
    child: parentTree, // 👈 like 'left/right' in downline, you can name it 'child' or 'upline'
  };
}


// 2. Build tree from buyer
// const uplineTree = await buildUplineTree(buyer._id);
console.log("🔼 Full Upline Tree:", uplineTree);

// 3. Filter eligible uplines based on GenerationLevel
const eligibleUplines = uplineTree
  .map((uplineUser, index) => {
    const requiredLevel = index + 1;
    if (uplineUser.GenerationLevel >= requiredLevel) {
      return { ...uplineUser, level: requiredLevel };
    } else {
      console.log(
        `❌ Not eligible - ${uplineUser.name}, GenLevel: ${uplineUser.GenerationLevel}, required: ${requiredLevel}`
      );
      return null;
    }
  })
  .filter(Boolean);

console.log("✅ Eligible uplines based on GenerationLevel:", eligibleUplines);

  // Repurchases 10% bonus
  const alreadyReceivedPersonalReward = buyer.AllEntry.incoming.some(
    (entry) => entry.sector === "10% personal reward from purchase"
  );

  if (alreadyReceivedPersonalReward) {
    console.log("Already received personal reward.");
    buyer.points = (buyer.points || 0) + tenPercent;
    buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
    buyer.AllEntry.incoming.push({
      fromUser: buyer._id,
      pointReceived: tenPercent,
      sector: '10% personal reward from purchase',
      date: new Date()
    });
    await buyer.save();
  } else {
    console.log("Eligible to receive personal reward.");
  }


  //   // 3. 📞 20% to phone number referrer
  if (buyerphone) {
    const phoneReferrer = await User.findOne({ referralCode: buyer?.referredBy });
    console.log("Phone referrer found:", phoneReferrer ? phoneReferrer.name : "None");
    if (phoneReferrer) {
      phoneReferrer.points = (phoneReferrer.points || 0) + twentyPercent;
      phoneReferrer.AllEntry = phoneReferrer.AllEntry || { incoming: [] };
      phoneReferrer.AllEntry.incoming.push({
        fromUser: buyerId,
        pointReceived: twentyPercent,
        sector: '20% phone referrer commission',
        date: new Date()
      });
      await phoneReferrer.save();
    }
  }

  // // 30% bonus to upline placementBy

  if(buyer){
    console.log("Buyer found from 30% referral", buyer.name);
  }




  
  // 1. ✅ Buyer gets 10%
  // buyer.points = (buyer.points || 0) + tenPercent;
  // buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
  // buyer.AllEntry.incoming.push({
  //   fromUser: buyer._id,
  //   pointReceived: tenPercent,
  //   sector: '10% personal reward from purchase',
  //   date: new Date()
  // });
  // await buyer.save();


  // 2. 🔁 Upline 30% generation share
  
  
  // 30% generation commission

  // console.log("Max level:", maxLevel, "Point per level:", pointPerLevel);

  //   let receiversCount = 0; // ei variable diye track korbo koyjon receive korlo

  // let current = buyer;
  // let level = 1;

  // while (level <= maxLevel) {
  //   const referrer = await User.findOne({ referralCode: current.referredBy });

  //   if (!referrer) break;

  //   console.log(`Level ${level} referrer:`, referrer.name || "None");

  //   if (referrer.GenerationLevel >= level) {
  //     receiversCount++; // ✅ jodi ei level e receive kore tahole count barabo

  //     referrer.points = (referrer.points || 0) + pointPerLevel;
  //     referrer.AllEntry = referrer.AllEntry || { incoming: [] };
  //     referrer.AllEntry.incoming.push({
  //       fromUser: buyerId,
  //       pointReceived: pointPerLevel,
  //       sector: `Level ${level} generation commission`,
  //       date: new Date()
  //     });

  //     await referrer.save();
  //   }

  //   current = referrer;
  //   level++;
  // }

  // // 🔍 Ekhon console e output dao
  // console.log(`Total ${receiversCount} referrers received generation commission from 30%`);





  // 20% Advance Consistency
  // const isAdvanceConsistancy = grandTotalPrice >= 5000 || grandTotalPrice <= 10000;
  // if (isAdvanceConsistancy) {
  //   console.log("Advance Consistency condition met for buyer:", buyer.name);
  //   if (buyer) {
  //     buyer.points = (buyer.points || 0) + twentyPercent;
  //     buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
  //     buyer.AllEntry.incoming.push({
  //       fromUser: buyer._id,
  //       pointReceived: twentyPercent,
  //       sector: '20% Advance Consistency commission',
  //       date: new Date()
  //     });
  //     await buyer.save();
  //   }
  // }

  // 10% repurchase bonus
  
  
  // 
  
  
  
  


  // 10% Commission for 4 months Consistency Purchase Product
// const checkContinuousPurchases = (incoming) => {
//   const now = new Date(); // আজকের তারিখ
//   const monthsToCheck = 4;
//   const purchaseMonths = new Set();

//   // Step 1: Filter and prepare month-year keys from incoming data
//   incoming.forEach((entry) => {
//     if (entry.sector === "10% personal reward from purchase") {
//       const entryDate = new Date(entry.date);
//       const year = entryDate.getFullYear();
//       const month = entryDate.getMonth(); // 0-based (Jan = 0)
//       const key = `${year}-${month}`;
//       purchaseMonths.add(key);
//     }
//   });

//   // Step 2: Check if each of the last 4 months is present in the set
//   const checkDate = new Date(now.getFullYear(), now.getMonth(), 1); // start of this month

//   for (let i = 1; i <= monthsToCheck; i++) {
//     checkDate.setMonth(checkDate.getMonth() - 1); // go to previous month
//     const year = checkDate.getFullYear();
//     const month = checkDate.getMonth();
//     const key = `${year}-${month}`;
//     if (!purchaseMonths.has(key)) {
//       return false; // missed at least one month
//     }
//   }

//   return true; // all 4 months are present
// };

// 🔍 ব্যবহারের উদাহরণ:
// const hasContinuousPurchases = checkContinuousPurchases(buyer.AllEntry.incoming);

// if (hasContinuousPurchases) {
//   console.log("✅ User has purchased continuously for the last 4 months.");
//   buyer.points = (buyer.points || 0) + tenPercent;
//     buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
//     buyer.AllEntry.incoming.push({
//       fromUser: buyer._id,
//       pointReceived: tenPercent,
//       sector: '10% bonus for 4 months Consistancy from purchase',
//       date: new Date()
//     });
//     await buyer.save();
// } else {
//   console.log("❌ User missed at least one of the last 4 months.");
// }




};




// 👉 POST: Admin creates an order
// server/routes/adminOrders.js
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      dspPhone,
      products,
      grandTotal,
      grandPoint,
      grandDiscount,
    } = req.body;

    const newOrder = new AdminOrder({
      userId,
      dspPhone,
      products,
      grandTotal,
      grandPoint,
      grandDiscount,
      date: new Date().toISOString(),
    });

    const savedOrder = await newOrder.save();
    await distributeGrandPoint(userId, grandPoint, dspPhone, grandTotal);
    console.log("userId:", savedOrder, "grandPoint:", grandPoint, "Phone:", dspPhone);
    console.log("Order created:", savedOrder._id);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
});

// ✅ GET: Fetch by DSP phone
router.get("/by-phone/:phone", async (req, res) => {
  try {
    const orders = await AdminOrder.find({ dspPhone: req.params.phone });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});

// ✅ GET: Fetch by userId
router.get("/by-user/:userId", async (req, res) => {
  try {
    const orders = await AdminOrder.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await AdminOrder.find(); // ✅ সব order fetch করবে
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});

module.exports = router;
