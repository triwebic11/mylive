const express = require("express");
const router = express.Router();
const User = require("../models/User");
const AdminOrder = require("../models/AdminOrder");
const DspInventory = require("../models/DspInventory");
const AdminStore = require("../models/AdminStore");
const RankUpgradeRequest = require("../models/RankUpgradeRequest");

// 👉 Order Create (Admin → DSP / DSP → User)
// Order create
// router.post("/", async (req, res) => {
//   try {
//     const {
//       userId,
//       dspPhone,
//       orderedFor,
//       createdBy,
//       products,
//       grandTotal,
//       freeGrandTotal,
//       grandPoint,
//       grandDiscount,
//     } = req.body;


//     // 4. Distribute points
//     await distributeGrandPoint(userId, grandPoint, dspPhone, grandTotal);

//     // Step 1: Admin ordering for DSP
//     if (orderedFor === "dsp") {
//       for (const p of products) {
//         const existing = await DspInventory.findOne({
//           dspPhone,
//           productId: p.productId,
//         });

//         if (existing) {
//           existing.quantity += p.quantity;
//           await existing.save();
//         } else {
//           await DspInventory.create({
//             dspPhone,
//             productId: p.productId,
//             productName: p.name,
//             quantity: p.quantity,
//           });
//         }
//       }

//       const newOrder = new AdminOrder({
//         userId,
//         dspPhone,
//         orderedFor,
//         createdBy,
//         products,
//         grandTotal,
//         freeGrandTotal,
//         grandPoint,
//         grandDiscount,
//         date: new Date().toISOString(),
//       });

//       const savedOrder = await newOrder.save();
//       return res.status(201).json({
//         message: "Admin → DSP order created",
//         order: savedOrder,
//       });
//     }

//     // Step 2: DSP ordering for user
//     if (orderedFor === "user") {
//       // 1. Quantity check
//       for (const p of products) {
//         const stock = await DspInventory.findOne({
//           dspPhone: createdBy,
//           productId: p.productId,
//         });

//         if (!stock || stock.quantity < p.quantity) {
//           return res.status(400).json({
//             message: Stock unavailable for ${p.productId}, ${p.name},
//           });
//         }
//       }

//       // 2. Deduct quantity
//       for (const p of products) {
//         await DspInventory.updateOne(
//           { dspPhone: createdBy, productId: p.productId },
//           { $inc: { quantity: -p.quantity } }
//         );
//       }

//       // 3. Save order
//       const newOrder = new AdminOrder({
//         userId,
//         dspPhone,
//         orderedFor,
//         createdBy,
//         products,
//         grandTotal,
//         freeGrandTotal,
//         grandPoint,
//         grandDiscount,
//         date: new Date().toISOString(),
//       });

//       const savedOrder = await newOrder.save();


//       return res.status(201).json({
//         message: "DSP → User order created",
//         order: savedOrder,
//       });
//     }

//     res.status(400).json({ message: "Invalid order type" });
//     // console.log("🔶 Incoming Order:", req.body);
//   } catch (error) {
//     console.error("❌ Error creating order:", error);
//     res.status(500).json({ message: "Failed to create order", error });
//   }
// });

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      dspPhone,
      orderedFor,
      createdBy,
      products,
      grandTotal,
      freeGrandTotal,
      grandPoint,
      grandDiscount,
    } = req.body;

    let userPromise = Promise.resolve(); // default no-op
    const buyer = await User.findOne({ phone: dspPhone });

    if (grandPoint || buyer.points * 10 > 500) {
      if (buyer?.isActivePackage === "In Active") {
        buyer.isActivePackage = "active";

        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);
        buyer.packageExpireDate = expireDate;

        userPromise = buyer.save();

        console.log(
          `✅ User ${buyer._id} re-activated. New expire date: ${buyer.packageExpireDate}`
        );
      }
    }

    const newOrder = new AdminOrder({
      userId,
      dspPhone,
      orderedFor,
      createdBy,
      products,
      grandTotal,
      freeGrandTotal,
      grandPoint,
      grandDiscount,
      date: new Date().toISOString(),
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: `${
        orderedFor === "dsp" ? "Admin → DSP" : "DSP → User"
      } order created successfully`,
      order: savedOrder,
    });

    process.nextTick(async () => {
      try {
        await userPromise;

        await distributeGrandPoint(userId, grandPoint, dspPhone, grandTotal);

        if (orderedFor === "dsp") {
          // Admin → DSP
          for (const p of products) {
            const existing = await DspInventory.findOne({
              dspPhone,
              productId: p.productId,
            });

            if (existing) {
              existing.quantity += p.quantity;
              await existing.save();
            } else {
              await DspInventory.create({
                dspPhone,
                productId: p.productId,
                productName: p.name,
                quantity: p.quantity,
              });
            }
          }
        }

        if (orderedFor === "user") {
          // DSP → User
          for (const p of products) {
            const stock = await DspInventory.findOne({
              dspPhone: createdBy,
              productId: p.productId,
            });
            if (!stock || stock.quantity < p.quantity) {
              console.warn(
                `⚠ Stock unavailable for ${p.productId}, ${p.name}`
              );
              continue;
            }

            await DspInventory.updateOne(
              { dspPhone: createdBy, productId: p.productId },
              { $inc: { quantity: -p.quantity } }
            );
          }
        }

        console.log("✅ Background order processing completed.");
      } catch (err) {
        console.error("❌ Error in background task:", err);
      }
    });
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

  // 2) Recursive total point calculation (lifetime points)
  const calculateTotalPoints = (node) => {
    if (!node) return 0;
    const selfPoints = node.points || 0;
    const leftPoints = calculateTotalPoints(node.left);
    const rightPoints = calculateTotalPoints(node.right);
    return selfPoints + leftPoints + rightPoints;
  };

  const totalPointsFromLeft = calculateTotalPoints(leftChild);
  const totalPointsFromRight = calculateTotalPoints(rightChild);

  // 3) Monthly incoming sum (ONLY current month for one user)
  const getMonthlyIncoming = async (id) => {
    const u = await User.findById(id);
    if (!u?.AllEntry?.incoming) return 0;

    let total = 0;
    const now = new Date();

    for (const entry of u.AllEntry.incoming) {
      const entryDate = new Date(entry.date);

      // ✅ শুধু এই মাস ও বছরের income হিসাব হবে
      if (
        entryDate.getMonth() === now.getMonth() &&
        entryDate.getFullYear() === now.getFullYear()
      ) {
        total += entry.pointReceived;
      }
    }
    return total;
  };

  // 4) শুধু সরাসরি leftChild আর rightChild এর monthly income
  const monthlyleftBV = leftChild ? await getMonthlyIncoming(leftChild._id) : 0;
  const monthlyrightBV = rightChild ? await getMonthlyIncoming(rightChild._id) : 0;

  // 5) Return structured tree
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
    monthlyleftBV,      // ✅ শুধু এক লেভেল left
    monthlyrightBV,     // ✅ শুধু এক লেভেল right
    totalPointsFromLeft,
    totalPointsFromRight,
  };
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

    const leftBV = tree.left.points;
    const rightBV = tree.right.points;

    // console.log("Left Tree:", leftBV);
    // console.log("Right Tree:", rightBV);

    const matchedRank = positionLevels
      .slice()
      .reverse()
      .find((level) => leftBV >= level.leftBV && rightBV >= level.rightBV);
    // console.log("Matched Rank:", matchedRank);

    if (!matchedRank) return;

    const user = await User.findById(buyer._id);

    // // Update if new position is higher than existing
    const currentRankIndex = positionLevels.findIndex(
      (r) => r.position === user.Position
    );
    const newRankIndex = positionLevels.findIndex(
      (r) => r.position === matchedRank.position
    );

    if (newRankIndex > currentRankIndex) {
      user.Position = matchedRank.position;
      user.rewards = matchedRank.reward;
      user.GenerationLevel = matchedRank.generationLevel;
      user.MegaGenerationLevel = matchedRank.megaGenerationLevel;
      if (buyer.isActivePackage === "expire" || buyer.isActivePackage === "In Active") {
        buyer.isActivePackage = "active";
        // 30 din er expire date
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);
        buyer.packageExpireDate = expireDate;

        // console.log(✅ User ${buyer._id} re-activated. New expire date: ${buyer.packageExpireDate});
      }

      if (!user.rewards?.includes(matchedRank.reward)) {
        user.rewards = [...(user.rewards || []), matchedRank.reward];
      }

      await user.save();

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
      //   ✅ Rank upgrade request saved for ${user.name} to ${matchedRank.position}
      // );
      // console.log(
      //   ✅ User ${user._id} upgraded to ${matchedRank.position} with reward: ${matchedRank.reward}
      // );
    }
  } catch (error) {
    console.error("❌ Error updating ranks and rewards:", error);
  }
};

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

const PackageLevelsdefine = async (buyerId, grandPoint) => {
  try {

    // console.log("Running PackageLevelsdefine for user:", buyerId);
    // always DB theke fresh document niben
    const buyer = await User.findById(buyerId);

    console.log("Buyer current points:", buyer?.points);

    // console.log("Grand points from purchase:", grandPoint + buyer?.points);

    if (!buyer) {
      return;
    }

    const tenPercentOfGrandPoint = grandPoint * 0.10;
    console.log("Ten parcent package level:", tenPercentOfGrandPoint);

    if (
      (!buyer.Position || buyer.Position.trim() === "" || buyer.Position === "Executive Officer")
      && tenPercentOfGrandPoint >= 500
    ) {
      console.log("Position empty or Executive Officer AND points >= 500: special action");

      const givenpoint = buyer?.points + grandPoint;
      const matchedRank = PackageLevels.slice()
        .reverse()
        .find((level) => givenpoint >= level.pointsBV);

      if (matchedRank) {
        buyer.package = matchedRank.Package;
        buyer.GenerationLevel = matchedRank.generationLevel;
        buyer.MegaGenerationLevel = matchedRank.megaGenerationLevel;
        if (buyer.isActivePackage === "expire" || buyer.isActivePackage === "In Active") {
          buyer.isActivePackage = "active";
          const expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 30);
          buyer.packageExpireDate = expireDate;
        }


        await buyer.save();
      }
    }
    else if (
      buyer.Position &&
      buyer.Position.trim() !== "" &&
      buyer.Position !== "Executive Officer" && // ❌ একেবারেই Executive Officer হবে না
      positionLevels.some(level => level.position === buyer.Position) && // ✅ অবশ্যই valid rank
      tenPercentOfGrandPoint >= 1000
    ) {
      console.log("Upto 1000 points special action");

      console.log("Buyer current points:", buyer?.points);
      console.log("Ten percent of grand point:", tenPercentOfGrandPoint);

      const givenpoint = buyer?.points + grandPoint;

      const matchedRank = PackageLevels.slice()
        .reverse()
        .find((level) => givenpoint >= level.pointsBV);

      if (matchedRank) {
        buyer.package = matchedRank.Package;
        buyer.GenerationLevel = matchedRank.generationLevel;
        buyer.MegaGenerationLevel = matchedRank.megaGenerationLevel;
        if (buyer.isActivePackage === "expire" || buyer.isActivePackage === "In Active") {
          buyer.isActivePackage = "active";
          const expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 30);
          buyer.packageExpireDate = expireDate;
        }


        await buyer.save();
      }
    }



  } catch (error) {
    console.error("❌ Error in PackageLevelsdefine:", error);
  }
};




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


const distributeGrandPoint = async (
  buyerId,
  grandPoint,
  buyerphone,
  grandTotalPrice
) => {
  const buyer = await User.findOne({ phone: buyerphone });

  // console.log("buyer-------", buyer)
  if (!buyer) return;

    console.log("Buyer", buyer?.points);
    const givenpoint = buyer?.points + grandPoint;
  // console.log("Referral Tree:", tree.left?.points, tree.right?.points);
  // ✅ Condition: If both sides have ≥ 30000 => Rank upgrade logic
  if (buyer?.points < 17501) {

    // console.log(grandPoint)

    // console.log("Buyer points less than 17500, running package level logic");
    // console.log("Both sides have enough points, running rank update logic");
    // await UpdateRanksAndRewards(buyer);
    await PackageLevelsdefine(buyer, grandPoint);
  }



  const fifteenPercent = grandPoint * 0.15;

  if (buyer?.role === "dsp") {
    // console.log("dsp getting.....")
    buyer.points = (buyer.points || 0) + fifteenPercent;
    buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
    buyer.AllEntry.incoming.push({
      fromUser: buyer._id,
      pointReceived: fifteenPercent,
      sector: "15% dsp reward from purchase",
      date: new Date(),
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

  // console.log("ten percent:", tenPercent);


  // 20% phone referrer
  // console.log("Buyer Referred By:", buyer?.referredBy);
  if (buyer?.referredBy) {
    const phoneReferrer = await User.findOne({
      referralCode: buyer.referredBy,
    });
    // console.log("Phone Referrer:", phoneReferrer);
    if (phoneReferrer) {
      phoneReferrer.points = (phoneReferrer.points || 0) + twentyPercent;
      phoneReferrer.AllEntry = phoneReferrer.AllEntry || { incoming: [] };
      phoneReferrer.AllEntry.incoming.push({
        fromUser: buyerId,
        pointReceived: twentyPercent,
        sector: "20% phone referrer commission",
        date: new Date(),
      });
      await phoneReferrer.save();
    }
  }

  const alreadyReceivedPersonalReward = buyer.AllEntry?.incoming?.some(
    (entry) => entry.sector === "10% personal reward from purchase"
  );

  console.log("ten parcent", tenPercent)
  if (alreadyReceivedPersonalReward) {
    buyer.points = (buyer.points || 0) + tenPercent;
    buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
    buyer.AllEntry.incoming.push({
      fromUser: buyer._id,
      pointReceived: tenPercent,
      sector: "10% personal reward from purchase",
      date: new Date(),
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
        sector: "10% personal reward from purchase",
        date: new Date(),
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
        sector: "Shared Generation Commission",
        date: new Date()
      });

      await uplineUser.save();
    }
  }

  // *****************************************************************

  // 7%  Mega generation logic

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
          sector: 'Shared mega Generation Commission',
          date: new Date()
        });

        await uplineUser.save();
      }
    }
  }




  // *********************************************************************
  await AdminStore.create({
    datafrom: buyer._id,
    Executive_Officer: threePercent,
    Special_Fund: fourPercent,
    Car_Fund: fourPercent,
    Tour_Fund: fourPercent,
    Home_Fund: threePercent,
  });


  // *****************************************************************


  // User Package Update

  const tree = await buildTree(buyer._id);
  const leftPoints = tree.left?.points || 0;
  const rightPoints = tree.right?.points || 0;


  // else {
  //   // ✅ Otherwise run package-level fallback logic
  //   // console.log("Running package-level fallback logic");
  // }

};
module.exports = router;