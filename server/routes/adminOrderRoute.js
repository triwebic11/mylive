const express = require("express");
const router = express.Router();
const AdminOrder = require("../models/AdminOrder");
const User = require("../models/User");

async function buildTree(userId) {
  const user = await User.findById(userId);
  if (!user) return null;

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

  // Recursive total point calculation
  const calculateTotalPoints = (node) => {
    if (!node) return 0;
    const selfPoints = node.points || 0;
    const leftPoints = calculateTotalPoints(node.left);
    const rightPoints = calculateTotalPoints(node.right);
    return selfPoints + leftPoints + rightPoints;
  };

  const totalPointsFromLeft = calculateTotalPoints(leftChild);
  const totalPointsFromRight = calculateTotalPoints(rightChild);

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
    totalPointsFromLeft,
    totalPointsFromRight,
  };
}
async function buildUplineTree(userId, depth = 0, maxDepth = 10, visited = new Set()) {
  if (depth > maxDepth) return [];

  const user = await User.findById(userId);
  if (!user || visited.has(user._id.toString())) return [];

  visited.add(user._id.toString());

  const query = [];
  if (user.referredBy) query.push({ referralCode: user.referredBy });
  if (user.placementBy) query.push({ referralCode: user.placementBy });

  const parent = await User.findOne({ $or: query });

  const currentNode = {
    name: user.name,
    _id: user._id,
    phone: user.phone,
    referralCode: user.referralCode,
    referredBy: user.referredBy,
    placementBy: user.placementBy,
    GenerationLevel: user.GenerationLevel ?? 0
  };

  if (!parent) {
    return [currentNode];
  }

  const parentTree = await buildUplineTree(parent._id, depth + 1, maxDepth, visited);
  return [...parentTree, currentNode];
}
const positionLevels = [
  {
    rank: 1,
    leftPV: 5,
    rightPV: 5,
    leftBV: 30000,
    rightBV: 30000,
    position: "Executive Officer",
    reward: "Frying Pan",
  },
  {
    rank: 2,
    leftPV: 15,
    rightPV: 15,
    leftBV: 90000,
    rightBV: 90000,
    position: "Executive Manager",
    reward: "Rice Cooker",
  },
  {
    rank: 3,
    leftPV: 50,
    rightPV: 50,
    leftBV: 300000,
    rightBV: 300000,
    position: "Executive Director",
    reward: "Inani Tour or ৳10,000 cash",
  },
  {
    rank: 4,
    leftPV: 120,
    rightPV: 120,
    leftBV: 720000,
    rightBV: 720000,
    position: "Executive Pal Director",
    reward: "Cox’s Bazar Tour",
  },
  {
    rank: 5,
    leftPV: 220,
    rightPV: 220,
    leftBV: 1320000,
    rightBV: 1320000,
    position: "Executive Total Director",
    reward: "Laptop or ৳30,000 cash",
  },
  {
    rank: 6,
    leftPV: 500,
    rightPV: 500,
    leftBV: 3000000,
    rightBV: 3000000,
    position: "EX = Emerald",
    reward: "Bike or ৳50,000 cash",
  },
  {
    rank: 7,
    leftPV: 1000,
    rightPV: 1000,
    leftBV: 6000000,
    rightBV: 6000000,
    position: "EX = Elite",
    reward: "Thailand Tour or ৳1,25,000 cash",
  },
  {
    rank: 8,
    leftPV: 2000,
    rightPV: 2000,
    leftBV: 12000000,
    rightBV: 12000000,
    position: "EX = Deluxe",
    reward: "Hajj/Umrah or ৳3,00,000 cash",
  },
  {
    rank: 9,
    leftPV: 4000,
    rightPV: 4000,
    leftBV: 24000000,
    rightBV: 24000000,
    position: "EX = Marjury",
    reward: "Car or ৳6,00,000 cash",
  },
  {
    rank: 10,
    leftPV: 8000,
    rightPV: 8000,
    leftBV: 48000000,
    rightBV: 48000000,
    position: "Diamond",
    reward: "Car or ৳13,00,000 cash",
  },
  {
    rank: 11,
    leftPV: 16000,
    rightPV: 16000,
    leftBV: 96000000,
    rightBV: 96000000,
    position: "Double Diamond",
    reward: "Private Car or ৳25,00,000 cash",
  },
  {
    rank: 12,
    leftPV: 24000,
    rightPV: 24000,
    leftBV: 144000000,
    rightBV: 144000000,
    position: "Crown Director",
    reward: "৳50,00,000 cash",
  },
  {
    rank: 13,
    leftPV: 37000,
    rightPV: 37000,
    leftBV: 222000000,
    rightBV: 222000000,
    position: "Star Crown",
    reward: "Mansion or ৳1 crore cash",
  },
  {
    rank: 14,
    leftPV: 50000,
    rightPV: 50000,
    leftBV: 300000000,
    rightBV: 300000000,
    position: "Universal Crown",
    reward: "৳5 crore cash or Villa",
  },
];



const UpdateRanksAndRewards = async (buyer) => {
  console.log("Updating ranks and rewards for user:", buyer);

  try {
    const tree = await buildTree(buyer._id);
    if (!tree) return;

    const leftTree = tree.left;
    const rightTree = tree.right;

    console.log("Left Tree:", leftTree?.points);
    console.log("Right Tree:", rightTree?.points);


    // const leftPV = await calculateTotalPV(leftTree);
    // const rightPV = await calculateTotalPV(rightTree);

    // const matchedRank = positionLevels
    //   .slice()
    //   .reverse()
    //   .find(
    //     (level) =>
    //       leftPV >= level.leftPV && rightPV >= level.rightPV
    //   );

    // if (!matchedRank) return;

    // const user = await User.findById(buyer._id);

    // // Update if new position is higher than existing
    // const currentRankIndex = positionLevels.findIndex(
    //   (r) => r.position === user.Position
    // );
    // const newRankIndex = positionLevels.findIndex(
    //   (r) => r.position === matchedRank.position
    // );

    // if (newRankIndex > currentRankIndex) {
    //   user.Position = matchedRank.position;

    //   if (!user.rewards?.includes(matchedRank.reward)) {
    //     user.rewards = [...(user.rewards || []), matchedRank.reward];
    //   }

    //   await user.save();
    //   console.log(
    //     `✅ User ${user._id} upgraded to ${matchedRank.position} with reward: ${matchedRank.reward}`
    //   );
    // }
  } catch (error) {
    console.error("❌ Error updating ranks and rewards:", error);
  }
}


async function buildUplineChainMultipleParents(userId, depth = 0, maxDepth = 10, visited = new Set()) {
  if (depth > maxDepth) return [];

  const user = await User.findById(userId).lean();
  if (!user || visited.has(user._id.toString())) return [];

  visited.add(user._id.toString());

  const parents = await User.find({
    $or: [
      { referralCode: user.referredBy },
      { referralCode: user.placementBy }
    ].filter(cond => Object.values(cond)[0])
  }).lean();

  if (!parents.length) {
    return [user];
  }

  let chains = [];

  for (const parent of parents) {
    const chain = await buildUplineChainMultipleParents(parent._id, depth + 1, maxDepth, visited);
    chains.push(...chain);
  }

  // Optional: remove duplicates and sort if needed
  // For simplicity, just return parents + current user as linear array
  return [...chains, user];
}


const distributeGrandPoint = async (buyerId, grandPoint, buyerphone, grandTotalPrice) => {
  const buyer = await User.findOne({ phone: buyerphone });
  if (!buyer) return;

  const fifteenPercent = grandPoint * 0.15;

  if (buyer?.role === "dsp") {
    buyer.points = (buyer.points || 0) + fifteenPercent;
    buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
    buyer.AllEntry.incoming.push({
      fromUser: buyer._id,
      pointReceived: fifteenPercent,
      sector: '15% dsp reward from purchase',
      date: new Date()
    });
    await buyer.save();
    return;
  }

  if (buyer?.role === "admin") return;

  const tenPercent = grandPoint * 0.10;
  const thirtyPercent = grandPoint * 0.30;
  const twentyPercent = grandPoint * 0.20;
  const sevenPercent = grandPoint * 0.07;
  const threePercent = grandPoint * 0.03;
  const fourPercent = grandPoint * 0.04;


  // 20% phone referrer
  console.log("Buyer Referred By:", buyer?.referredBy);
  if (buyer?.referredBy) {
    const phoneReferrer = await User.findOne({ referralCode: buyer.referredBy });
    console.log("Phone Referrer:", phoneReferrer);
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


  const alreadyReceivedPersonalReward = buyer.AllEntry?.incoming?.some(
    (entry) => entry.sector === "10% personal reward from purchase"
  );

  if (alreadyReceivedPersonalReward) {
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
    // 10% direct commission
    if (buyer) {
      buyer.points = (buyer.points || 0) + tenPercent;
      buyer.AllEntry = buyer.AllEntry || { incoming: [] };
      buyer.AllEntry.incoming.push({
        fromUser: buyerId,
        pointReceived: tenPercent,
        sector: '10% personal reward from purchase',
        date: new Date()
      });
      await buyer.save();
    }

  }


  // 30% shared generation commission
  // *****************************************************************

  const uplineFlat = await buildUplineChainMultipleParents(buyer._id);
  const filteredUpline = uplineFlat.filter(
    (u) => u._id.toString() !== buyer._id.toString()
  );
  // console.log("Upline Flat Structure:", filteredUpline);

  const eligibleUplines = filteredUpline.filter(
    (u) => u.GenerationLevel > 0
  );

  function searchUserInTree(node, userId, maxDepth, currentDepth = 1) {
    if (!node || currentDepth > maxDepth) return false;

    if (node._id && node._id.toString() === userId.toString()) {
      return true;
    }

    return (
      searchUserInTree(node.left, userId, maxDepth, currentDepth + 1) ||
      searchUserInTree(node.right, userId, maxDepth, currentDepth + 1)
    );
  }

  const finalUplines = [];

  for (const upline of eligibleUplines) {
    const tree = await buildTree(upline._id); // upline's downline tree
    const foundUser = searchUserInTree(tree, buyer._id, upline.GenerationLevel);
    if (foundUser) {
      finalUplines.push(upline);
    }
  }

  if (finalUplines.length > 0) {
    const pointPerUpline = thirtyPercent / finalUplines.length;

    for (const upline of finalUplines) {
      const uplineUser = await User.findById(upline._id);
      if (!uplineUser) continue;

      uplineUser.points = (uplineUser.points || 0) + pointPerUpline;

      uplineUser.AllEntry = uplineUser.AllEntry || { incoming: [], outgoing: [] };
      uplineUser.AllEntry.incoming.push({
        fromUser: buyer._id,
        pointReceived: pointPerUpline,
        sector: `Shared Generation Commission`,
        date: new Date()
      });

      await uplineUser.save();
    }
  }

  // *****************************************************************

  // Mega generation logic

  const MegauplineFlat = await buildUplineChainMultipleParents(buyer._id);
  const MegafilteredUpline = MegauplineFlat.filter(
    (u) => u._id.toString() !== buyer._id.toString()
  );
  // console.log("Upline Flat Structure:", filteredUpline);

  const MegaeligibleUplines = MegafilteredUpline.filter(
    (u) => u.MegaGenerationLevel > 0
  );

  function searchUserInTree(node, userId, maxDepth, currentDepth = 1) {
    if (!node || currentDepth > maxDepth) return false;

    if (node._id && node._id.toString() === userId.toString()) {
      return true;
    }

    return (
      searchUserInTree(node.left, userId, maxDepth, currentDepth + 1) ||
      searchUserInTree(node.right, userId, maxDepth, currentDepth + 1)
    );
  }

  const MegafinalUplines = [];

  for (const upline of MegaeligibleUplines) {
    const tree = await buildTree(upline._id); // upline's downline tree
    const foundUser = searchUserInTree(tree, buyer._id, upline.MegaGenerationLevel);
    if (foundUser) {
      MegafinalUplines.push(upline);
    }
  }




  // Check if user has a position before distributing commission
  if (buyer?.Position) {
    if (MegafinalUplines.length > 0) {
      const pointPerUpline = sevenPercent / MegafinalUplines.length;

      for (const upline of MegafinalUplines) {
        const uplineUser = await User.findById(upline._id);
        if (!uplineUser) continue;

        uplineUser.points = (uplineUser.points || 0) + pointPerUpline;

        uplineUser.AllEntry = uplineUser.AllEntry || { incoming: [], outgoing: [] };
        uplineUser.AllEntry.incoming.push({
          fromUser: buyer._id,
          pointReceived: pointPerUpline,
          sector: `Shared mega Generation Commission`,
          date: new Date()
        });

        await uplineUser.save();
      }
    }
  }



  // *****************************************************************

  // 3% shared generation commission for Executive Manager and above

  const ExcutiveOfficereligibleUplines = finalUplines.filter((u) =>
    u.Position === 'Excutive Officer'
  );

  if (ExcutiveOfficereligibleUplines.length > 0) {

    const pointPerUpline = threePercent / ExcutiveOfficereligibleUplines.length;
    for (const upline of ExcutiveOfficereligibleUplines) {
      const uplineUser = await User.findById(upline._id);
      if (!uplineUser) continue;

      uplineUser.points = (uplineUser.points || 0) + pointPerUpline;

      uplineUser.AllEntry = uplineUser.AllEntry || { incoming: [], outgoing: [] };
      uplineUser.AllEntry.incoming.push({
        fromUser: buyer._id,
        pointReceived: pointPerUpline,
        sector: `Executive Officer Commission`,
        date: new Date()
      });

      await uplineUser.save();
    }
  }


  // *****************************************************************

  // 4% shared generation commission for Executive Manager and above

  const positioneligibleUplines = finalUplines.filter((u) =>
    u.Position === 'Executive Manager'
  );

  if (positioneligibleUplines.length > 0) {
    const pointPerUpline = fourPercent / positioneligibleUplines.length;

    for (const upline of positioneligibleUplines) {
      const uplineUser = await User.findById(upline._id);
      if (!uplineUser) continue;

      uplineUser.points = (uplineUser.points || 0) + pointPerUpline;

      uplineUser.AllEntry = uplineUser.AllEntry || { incoming: [], outgoing: [] };
      uplineUser.AllEntry.incoming.push({
        fromUser: buyer._id,
        pointReceived: pointPerUpline,
        sector: `Special Fund Commission`,
        date: new Date()
      });

      await uplineUser.save();
    }
  }

  // *****************************************************************
  // 4% shared generation commission for Executive Director and above

  const ExcutiveDirectoreligibleUplines = finalUplines.filter((u) =>
    u.Position === 'Executive Director'
  );

  if (ExcutiveDirectoreligibleUplines.length > 0) {
    const pointPerUpline = fourPercent / ExcutiveDirectoreligibleUplines.length;

    for (const upline of ExcutiveDirectoreligibleUplines) {
      const uplineUser = await User.findById(upline._id);
      if (!uplineUser) continue;

      uplineUser.points = (uplineUser.points || 0) + pointPerUpline;

      uplineUser.AllEntry = uplineUser.AllEntry || { incoming: [], outgoing: [] };
      uplineUser.AllEntry.incoming.push({
        fromUser: buyer._id,
        pointReceived: pointPerUpline,
        sector: `Travel Fund Commission`,
        date: new Date()
      });

      await uplineUser.save();
    }
  }

  // *****************************************************************
  // 4% shared generation commission for Diamond Director and above

  const DimondDirectoreligibleUplines = finalUplines.filter((u) =>
    u.Position === 'Diamond Director'
  );

  if (DimondDirectoreligibleUplines.length > 0) {
    const pointPerUpline = fourPercent / DimondDirectoreligibleUplines.length;

    for (const upline of DimondDirectoreligibleUplines) {
      const uplineUser = await User.findById(upline._id);
      if (!uplineUser) continue;

      uplineUser.points = (uplineUser.points || 0) + pointPerUpline;

      uplineUser.AllEntry = uplineUser.AllEntry || { incoming: [], outgoing: [] };
      uplineUser.AllEntry.incoming.push({
        fromUser: buyer._id,
        pointReceived: pointPerUpline,
        sector: `Car Fund Commission`,
        date: new Date()
      });

      await uplineUser.save();
    }
  }
  // *****************************************************************
  // 3% shared generation commission for Crown Director and above

  const CrawonDirectoreligibleUplines = finalUplines.filter((u) =>
    u.Position === 'Crown Director'
  );

  if (CrawonDirectoreligibleUplines.length > 0) {
    const pointPerUpline = threePercent / CrawonDirectoreligibleUplines.length;

    for (const upline of CrawonDirectoreligibleUplines) {
      const uplineUser = await User.findById(upline._id);
      if (!uplineUser) continue;

      uplineUser.points = (uplineUser.points || 0) + pointPerUpline;

      uplineUser.AllEntry = uplineUser.AllEntry || { incoming: [], outgoing: [] };
      uplineUser.AllEntry.incoming.push({
        fromUser: buyer._id,
        pointReceived: pointPerUpline,
        sector: `House Fund Commission`,
        date: new Date()
      });

      await uplineUser.save();
    }
  }


  // *****************************************************************


  // User Package Update
  await UpdateRanksAndRewards(buyer);

};

// Order create
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      dspPhone,
      products,
      grandTotal,
      freeGrandTotal,
      grandPoint,
      grandDiscount,
    } = req.body;

    const newOrder = new AdminOrder({
      userId,
      dspPhone,
      products,
      grandTotal,
      freeGrandTotal,
      grandPoint,
      grandDiscount,
      date: new Date().toISOString(),
    });

    const savedOrder = await newOrder.save();
    await distributeGrandPoint(userId, grandPoint, dspPhone, grandTotal);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
});

// Get orders by DSP phone
router.get("/by-phone/:phone", async (req, res) => {
  try {
    const orders = await AdminOrder.find({ dspPhone: req.params.phone });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});

// Get orders by user ID
router.get("/by-user/:userId", async (req, res) => {
  try {
    const orders = await AdminOrder.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await AdminOrder.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
});

module.exports = router;
