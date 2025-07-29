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
  }

  // 20% phone referrer
  if (buyer.referredBy) {
    const phoneReferrer = await User.findOne({ referralCode: buyer.referredBy });
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

  // 30% shared generation commission
  const uplineFlat = await buildUplineTree(buyer._id);
  const eligibleUplines = uplineFlat
    .map((uplineUser, index) => {
      const requiredLevel = index + 1;
      if (uplineUser.GenerationLevel >= requiredLevel) {
        return { ...uplineUser, level: requiredLevel };
      }
      return null;
    })
    .filter(Boolean);

    console.log("Eligible Uplines:", eligibleUplines);

  if (eligibleUplines.length > 0) {
    const pointPerUpline = thirtyPercent / eligibleUplines.length;
    for (const upline of eligibleUplines) {
      const uplineUser = await User.findById(upline._id);
      if (!uplineUser) continue;

      uplineUser.points = (uplineUser.points || 0) + pointPerUpline;
      uplineUser.AllEntry = uplineUser.AllEntry || { incoming: [], outgoing: [] };
      uplineUser.AllEntry.incoming.push({
        fromUser: buyer._id,
        pointReceived: pointPerUpline,
        sector: `Shared Generation Commission (Level ${upline.level})`,
        date: new Date()
      });
      await uplineUser.save();
    }
  }

  // 10% direct commission
    if (buyer) {
      buyer.points = (buyer.points || 0) + tenPercent;
      buyer.AllEntry = buyer.AllEntry || { incoming: [] };
      buyer.AllEntry.incoming.push({
        fromUser: buyerId,
        pointReceived: tenPercent,
        sector: '10% phone referrer commission',
        date: new Date()
      });
      await buyer.save();
    }
 


};

// Order create
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
