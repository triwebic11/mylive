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

const getReferralTreeById = async (req, res) => {
  try {
    const { userId } = req.params;
    const tree = await buildTree(userId);
    console.log("Referral Tree for:", userId);
    res.json(tree);
  } catch (err) {
    console.error("Tree build error:", err);
    res.status(500).json({ error: "Failed to fetch referral tree" });
  }
};

const distributeGrandPoint = async (buyerId, grandPoint, buyerphone) => {
  // const buyer = await User.findById(buyerId);
  const buyer = await User.findOne({ phone: buyerphone });
  if (!buyer) return;

  console.log("Distributing grand points for buyer(je product kinlo):", buyer);

  const tenPercent = grandPoint * 0.10;
  const thirtyPercent = grandPoint * 0.30;
  const twentyPercent = grandPoint * 0.20;

  // 1. ✅ Buyer gets 10%
  buyer.points = (buyer.points || 0) + tenPercent;
  buyer.AllEntry = buyer.AllEntry || { incoming: [], outgoing: [] };
  buyer.AllEntry.incoming.push({
    fromUser: buyer._id,
    pointReceived: tenPercent,
    sector: '10% personal reward from purchase',
    date: new Date()
  });
  await buyer.save();
  // 2. 🔁 Upline 30% generation share
  const maxLevel = 10; // or set dynamically from buyer if needed
  const pointPerLevel = thirtyPercent / maxLevel;
  console.log("Max level:", maxLevel, "Point per level:", pointPerLevel);

  let receiversCount = 0; // ei variable diye track korbo koyjon receive korlo

let current = buyer;
let level = 1;

while (level <= maxLevel) {
  const referrer = await User.findOne({ referralCode: current.referredBy });

  if (!referrer) break;

  console.log(`Level ${level} referrer:`, referrer.name || "None");

  if (referrer.GenerationLevel >= level) {
    receiversCount++; // ✅ jodi ei level e receive kore tahole count barabo

    referrer.points = (referrer.points || 0) + pointPerLevel;
    referrer.AllEntry = referrer.AllEntry || { incoming: [] };
    referrer.AllEntry.incoming.push({
      fromUser: buyerId,
      pointReceived: pointPerLevel,
      sector: `Level ${level} generation commission`,
      date: new Date()
    });

    await referrer.save();
  }

  current = referrer;
  level++;
}

// 🔍 Ekhon console e output dao
console.log(`Total ${receiversCount} referrers received generation commission from 30%`);




  // 3. 📞 20% to phone number referrer
  if (buyerphone) {
    const phoneReferrer = await User.findOne({ referralCode: buyerphone });
    if (phoneReferrer) {
      phoneReferrer.points = (phoneReferrer.points || 0) + twentyPercent;
      phoneReferrer.AllEntry = phoneReferrer.AllEntry || { incoming: [] };
      phoneReferrer.AllEntry.incoming.push({
        fromUserId: buyerId,
        points: twentyPercent,
        note: '20% phone referrer commission',
        date: new Date()
      });
      await phoneReferrer.save();
    }
  }
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
    await distributeGrandPoint(userId, grandPoint, dspPhone);
    console.log("userId:", savedOrder, "grandPoint:", grandPoint, "Phone:", dspPhone);
    // console.log("Order created:", savedOrder._id);

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
