const express = require("express");
const router = express.Router();
const User = require("../models/User");
const AdminOrder = require("../models/AdminOrder");
const DspInventory = require("../models/DspInventory");
const AdminStore = require("../models/AdminStore");
const AdminInventory = require("../models/AddProduct");
const DspReturnRequest = require("../models/DspReturnRequest");
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
//             message: `Stock unavailable for ${p.productId}, ${p.name}`,
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

    let userPromise = Promise.resolve();
    const buyer = await User.findOne({ phone: dspPhone });

    /** -------------------------
     *  ADMIN → DSP Order: First check stock
     * -------------------------- */
    if (orderedFor === "dsp") {
      for (const p of products) {
        const adminStock = await AdminInventory.findOne({
          productId: p.productId,
        });

        if (!adminStock || adminStock.quantity < p.quantity) {
          return res.status(400).json({
            message: `❌ Admin stock insufficient for ${p.name} (${
              p.productId
            }). Needed: ${p.quantity}, Available: ${adminStock?.quantity || 0}`,
          });
        }
      }
    }

    // ---------------- Create Order ----------------
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

    // =========== Background Async Operations ============
    process.nextTick(async () => {
      try {
        await userPromise;

        await distributeGrandPoint(userId, grandPoint, dspPhone, grandTotal);

        /** -------------------------
         *  ADMIN → DSP (AdminInventory -> DspInventory)
         * -------------------------- */
        if (orderedFor === "dsp") {
          for (const p of products) {
            // 1️⃣ Admin Inventory reduce
            await AdminInventory.updateOne(
              { productId: p.productId },
              { $inc: { quantity: -p.quantity } }
            );

            // 2️⃣ DSP Inventory increase
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

        /** -------------------------
         *  DSP → User (Check DSP Stock)
         * -------------------------- */
        if (orderedFor === "user") {
          for (const p of products) {
            const stock = await DspInventory.findOne({
              dspPhone: createdBy,
              productId: p.productId,
            });

            if (!stock || stock.quantity < p.quantity) {
              console.warn(
                `⚠️ Stock unavailable for ${p.productId}, ${p.name}`
              );
              continue;
            }

            await DspInventory.updateOne(
              { dspPhone: createdBy, productId: p.productId },
              { $inc: { quantity: -p.quantity } }
            );
          }
        }
      } catch (err) {
        console.error("❌ Error in background task:", err);
      }
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
});

router.post("/dsp-return", async (req, res) => {
  try {
    const { dspPhone, productId, productName, quantity, note } = req.body;

    // DSP er stock check
    const stock = await DspInventory.findOne({ dspPhone, productId });

    if (!stock || stock.quantity < quantity) {
      return res.status(400).json({
        message: `❌ DSP stock not enough! Available: ${stock?.quantity || 0}`,
      });
    }

    const newReq = await DspReturnRequest.create({
      dspPhone,
      productId,
      productName,
      quantity,
      note,
    });

    res.status(201).json({
      message: "Return request sent to admin",
      request: newReq,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating request", err });
  }
});

router.patch("/dsp-return/handle/:id", async (req, res) => {
  try {
    const { action } = req.body; // approve / reject
    const requestId = req.params.id;

    const reqData = await DspReturnRequest.findById(requestId);

    if (!reqData) return res.status(404).json({ message: "Request not found" });

    if (reqData.status !== "pending") {
      return res.status(400).json({
        message: `Already ${reqData.status}`,
      });
    }

    // Reject
    if (action === "reject") {
      reqData.status = "rejected";
      await reqData.save();
      return res.json({ message: "Request rejected", request: reqData });
    }

    // Approve logic
    if (action === "approve") {
      const { dspPhone, productId, quantity, productName } = reqData;

      // 1️⃣ DSP inventory কমাও
      const dspStock = await DspInventory.findOne({
        dspPhone,
        productId,
      });

      if (!dspStock || dspStock.quantity < quantity) {
        return res.status(400).json({
          message: "DSP stock insufficient for return.",
        });
      }

      dspStock.quantity -= quantity;
      await dspStock.save();

      // 2️⃣ Admin inventory বাড়াও
      const adminStock = await AdminInventory.findOne({ productId });

      if (adminStock) {
        adminStock.quantity += quantity;
        await adminStock.save();
      } else {
        await AdminInventory.create({
          productId,
          productName,
          quantity,
        });
      }

      // 3️⃣ Status update
      reqData.status = "approved";
      await reqData.save();

      return res.json({
        message: "Return approved & stock updated",
        request: reqData,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Error handling return request", err });
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

router.get("/dsp-return", async (req, res) => {
  const list = await DspReturnRequest.find().sort({ date: -1 });
  res.json(list);
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
        total += entry.grandpoints;
      }
    }
    return total;
  };

  // 4) শুধু সরাসরি leftChild আর rightChild এর monthly income
  const monthlyleftBV = leftChild ? await getMonthlyIncoming(leftChild._id) : 0;
  const monthlyrightBV = rightChild
    ? await getMonthlyIncoming(rightChild._id)
    : 0;

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
    monthlyleftBV, // ✅ শুধু এক লেভেল left
    monthlyrightBV, // ✅ শুধু এক লেভেল right
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
      if (
        buyer.isActivePackage === "expire" ||
        buyer.isActivePackage === "In Active"
      ) {
        buyer.isActivePackage = "active";
        // 30 din er expire date
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);
        buyer.packageExpireDate = expireDate;

        // console.log(`✅ User ${buyer._id} re-activated. New expire date: ${buyer.packageExpireDate}`);
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

    // console.log("Buyer current points:", buyer?.points);

    // console.log("Grand points from purchase:", grandPoint + buyer?.points);

    if (!buyer) {
      return;
    }

    const tenPercentOfGrandPoint = grandPoint * 0.1;
    // console.log("Ten parcent package level:", tenPercentOfGrandPoint);
    const givenpoint = buyer?.totalpurchasePoint + grandPoint;
    // console.log("Given point package level:", givenpoint);
    if (
      (!buyer.Position ||
        buyer.Position.trim() === "" ||
        buyer.Position === "Executive Officer") &&
      givenpoint >= 500
    ) {
      // console.log("Position empty or Executive Officer AND points >= 500: special action");

      // const givenpoint = buyer?.points + grandPoint;

      // console.log("Buyer current points:", buyer?.totalpurchasePoint + grandPoint);
      const matchedRank = PackageLevels.slice()
        .reverse()
        .find((level) => givenpoint >= level.pointsBV);

      if (matchedRank) {
        buyer.package = matchedRank.Package;
        buyer.GenerationLevel = matchedRank.generationLevel;
        buyer.MegaGenerationLevel = matchedRank.megaGenerationLevel;
        if (
          buyer.isActivePackage === "expire" ||
          buyer.isActivePackage === "In Active"
        ) {
          buyer.isActivePackage = "active";
          const expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 30);
          buyer.packageExpireDate = expireDate;
        }

        await buyer.save();
      }
    } else if (
      buyer?.Position &&
      buyer?.Position.trim() !== "" &&
      buyer?.Position !== "Executive Officer" && // ❌ একেবারেই Executive Officer হবে না
      positionLevels?.some((level) => level.position === buyer?.Position) && // ✅ অবশ্যই valid rank
      givenpoint >= 1000
    ) {
      // console.log("Upto 1000 points special action");

      // console.log("Buyer current points:", buyer?.totalpurchasePoint);
      // console.log("Ten percent of grand point:", tenPercentOfGrandPoint);

      // const givenpoint = buyer?.points + grandPoint;

      const matchedRank = PackageLevels.slice()
        .reverse()
        .find((level) => givenpoint >= level.pointsBV);

      if (matchedRank) {
        buyer.package = matchedRank.Package;
        buyer.GenerationLevel = matchedRank.generationLevel;
        buyer.MegaGenerationLevel = matchedRank.megaGenerationLevel;
        if (
          buyer.isActivePackage === "expire" ||
          buyer.isActivePackage === "In Active"
        ) {
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

async function buildUplineChainMultipleParents(
  userId,
  depth = 0,
  maxDepth = 10,
  visited = new Set()
) {
  try {
    // Stop recursion if depth exceeds limit
    if (!userId || depth > maxDepth) return [];

    // Prevent infinite recursion
    if (visited.has(userId.toString())) return [];
    visited.add(userId.toString());

    // Fetch user
    const user = await User.findById(userId).lean();
    if (!user) return [];

    // Get valid parent codes (referral & placement)
    const parentCodes = [user.referredBy, user.placementBy].filter(Boolean);
    if (parentCodes.length === 0) {
      return [user]; // no more parents, return current user
    }

    // Find all valid parents by referralCode
    const parents = await User.find({
      referralCode: { $in: parentCodes },
    }).lean();

    // If no parents found, return just current user
    if (!parents || parents.length === 0) {
      return [user];
    }

    let chains = [];

    // Recursively build upline for each parent
    for (const parent of parents) {
      const subChain = await buildUplineChainMultipleParents(
        parent._id,
        depth + 1,
        maxDepth,
        visited
      );
      chains.push(parent, ...subChain);
    }

    // Deduplicate by _id to avoid loops
    const uniqueChains = [];
    const seen = new Set();

    for (const u of chains) {
      if (u && !seen.has(u._id.toString())) {
        seen.add(u._id.toString());
        uniqueChains.push(u);
      }
    }

    return uniqueChains;
  } catch (err) {
    console.error("❌ Error in buildUplineChainMultipleParents:", err.message);
    return [];
  }
}

const distributeGrandPoint = async (
  buyerId,
  grandPoint,
  buyerphone,
  grandTotalPrice
) => {
  try {
    const buyer = await User.findOne({ phone: buyerphone });

    // console.log("⚡ Distributing grand points:", grandPoint, "to buyer ID:", buyerId);

    if (!buyer) {
      console.error("❌ Buyer not found for phone:", buyerphone);
      return;
    }

    // console.log("👤 Buyer current points:", buyer?.points);

    // 🧮 Update package levels for buyers below 17500 total purchase points
    if (buyer?.totalpurchasePoint < 17501) {
      await PackageLevelsdefine(buyer, grandPoint);
    }

    // 📊 Percentages
    const fifteenPercent = grandPoint * 0.15;
    const tenPercent = grandPoint * 0.1;
    const thirtyPercent = grandPoint * 0.3;
    const twentyPercent = grandPoint * 0.2;
    const sevenPercent = grandPoint * 0.07;
    const threePercent = grandPoint * 0.03;
    const fourPercent = grandPoint * 0.04;

    // 🧾 DSP logic
    if (buyer?.role === "dsp") {

      console.log("this is dsp--------", buyer?.role)
      buyer.points = (buyer.points || 0) + fifteenPercent;
      buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
      buyer.AllEntry.incoming.push({
        fromUser: buyer._id,
        pointReceived: fifteenPercent,
        sector: "15% DSP reward from purchase",
        date: new Date(),
      });
      await buyer.save();
      console.log("✅ DSP reward distributed.");
      return;
    }

    // 🛑 Admin doesn’t get distribution
    if (buyer?.role === "admin") {
      // console.log("⛔ Admin purchase — skipping reward distribution.");
      return;
    }

    // 💰 20% referrer commission
    if (buyer?.referredBy) {
      const phoneReferrer = await User.findOne({ referralCode: buyer.referredBy });
      console.log("🔍 Phone referrer found:", phoneReferrer ? phoneReferrer.phone : "None");
      if (phoneReferrer) {
        phoneReferrer.points = (phoneReferrer.points || 0) + twentyPercent;
        phoneReferrer.AllEntry = phoneReferrer.AllEntry || { incoming: [] };
        phoneReferrer.AllEntry.incoming.push({
          fromUser: buyerId,
          pointReceived: twentyPercent,
          sector: "20% referrer commission",
          date: new Date(),
        });
        await phoneReferrer.save();
        // console.log("✅ Phone referrer commission added.");
      }
    }

    // 🧾 Buyer personal reward 10%
    buyer.points = (buyer.points || 0) + tenPercent;
    buyer.totalAmount = (buyer.totalAmount || 0) + grandTotalPrice;
    buyer.totalpurchasePoint = (buyer.totalpurchasePoint || 0) + grandPoint;
    buyer.AllEntry = buyer.AllEntry || { incoming: [] };
    buyer.AllEntry.incoming.push({
      fromUser: buyer._id,
      pointReceived: tenPercent,
      sector: "10% Personal reward from purchase",
      purchaseAmount: grandTotalPrice,
      grandpoints: grandPoint,
      date: new Date(),
    });
    await buyer.save();
    // console.log("✅ Buyer personal reward distributed.");

    // *****************************************************************
    // 🏦 Shared Mega Generation Commission (7%)
    // *****************************************************************
    try {
      // console.log("🚀 Starting shared mega generation commission distribution...");

      if (!buyer._id || typeof sevenPercent !== "number" || sevenPercent <= 0) {
        console.error("❌ Invalid mega generation commission parameters.");
      } else {
        const MegauplineFlat = await buildUplineChainMultipleParents(buyer._id);
        if (!Array.isArray(MegauplineFlat) || MegauplineFlat.length === 0) {
          console.warn("⚠️ No mega uplines found.");
        } else {
          const MegafilteredUpline = MegauplineFlat.filter(
            (u) => u?._id?.toString() !== buyer._id.toString()
          );

          const MegaeligibleUplines = MegafilteredUpline.filter(
            (u) => u?.MegaGenerationLevel > 0 && u?.isActivePackage === "active"
          );

          if (MegaeligibleUplines.length > 0) {
            const pointPerUpline = sevenPercent / MegaeligibleUplines.length;
            for (const upline of MegaeligibleUplines) {
              const uplineUser = await User.findById(upline._id);
              if (!uplineUser || uplineUser.isActivePackage !== "active")
                continue;

              uplineUser.points = (uplineUser.points || 0) + pointPerUpline;
              uplineUser.AllEntry = uplineUser.AllEntry || {
                incoming: [],
                outgoing: [],
              };
              uplineUser.AllEntry.incoming.push({
                fromUser: buyer._id,
                pointReceived: pointPerUpline,
                sector: "Shared Mega Generation Commission",
                date: new Date(),
              });
              await uplineUser.save();
            }
            // console.log(`✅ Distributed ${sevenPercent} mega generation commission.`);
          }
        }
      }
    } catch (err) {
      console.error("🔥 Error in mega generation commission:", err.message);
    }

    // *****************************************************************
    // 🧩 Shared Normal Generation Commission (30%)
    // *****************************************************************
    try {
      const uplineFlat = await buildUplineChainMultipleParents(buyer._id);
      const filteredUpline = uplineFlat.filter(
        (u) => u._id.toString() !== buyer._id.toString()
      );

      const eligibleUplines = filteredUpline.filter(
        (u) => u.GenerationLevel > 0 && u.isActivePackage === "active"
      );

      const finalUplines = [];

      function searchUserInTree(node, userId, maxDepth, currentDepth = 1) {
        if (!node || currentDepth > maxDepth) return false;
        if (node._id && node._id.toString() === userId.toString()) return true;
        return (
          searchUserInTree(node.left, userId, maxDepth, currentDepth + 1) ||
          searchUserInTree(node.right, userId, maxDepth, currentDepth + 1)
        );
      }

      for (const upline of eligibleUplines) {
        const tree = await buildTree(upline._id);
        const foundUser = searchUserInTree(
          tree,
          buyer._id,
          upline.GenerationLevel
        );
        if (foundUser) finalUplines.push(upline);
      }

      if (finalUplines.length > 0) {
        const pointPerUpline = thirtyPercent / finalUplines.length;
        for (const upline of finalUplines) {
          const uplineUser = await User.findById(upline._id);
          if (!uplineUser || uplineUser.isActivePackage !== "active") continue;

          uplineUser.points = (uplineUser.points || 0) + pointPerUpline;
          uplineUser.AllEntry = uplineUser.AllEntry || {
            incoming: [],
            outgoing: [],
          };
          uplineUser.AllEntry.incoming.push({
            fromUser: buyer._id,
            pointReceived: pointPerUpline,
            sector: "Shared Generation Commission",
            date: new Date(),
          });
          await uplineUser.save();
        }
        // console.log(`✅ Distributed ${thirtyPercent} shared generation commission.`);
      } else {
        console.warn(
          "⚠️ No final eligible uplines for shared generation commission."
        );
      }
    } catch (err) {
      console.error("🔥 Error in shared generation commission:", err.message);
    }

    // *****************************************************************
    // 🏛️ ADMIN STORE FUND DISTRIBUTION (3% + 4%)
    // *****************************************************************
    try {
      // console.log("🏦 Creating AdminStore entry...");

      if (!buyer?._id) {
        console.warn("⚠️ Buyer ID missing — skipping AdminStore creation.");
      } else if (
        isNaN(threePercent) ||
        isNaN(fourPercent) ||
        typeof grandPoint !== "number"
      ) {
        console.warn("⚠️ Invalid percent values:", {
          threePercent,
          fourPercent,
        });
      } else {
        const newEntry = await AdminStore.create({
          datafrom: buyer._id,
          Executive_Officer: threePercent,
          Special_Fund: fourPercent,
          Car_Fund: fourPercent,
          Tour_Fund: fourPercent,
          Home_Fund: threePercent,
        });

        // console.log("✅ AdminStore entry created successfully:", newEntry._id);
      }
    } catch (err) {
      console.error("❌ Error creating AdminStore entry:", err.message);
    }

    // console.log("🎯 Grand point distribution completed successfully for buyer:", buyer._id);
  } catch (err) {
    console.error("🚨 Fatal error in distributeGrandPoint:", err.message);
  }
};

module.exports = router;
