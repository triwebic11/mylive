// Required modules and models
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const User = require("../models/User");
const CashOnDeliveryModel = require("../models/CashOnDeliveryModel");
const {
  handleRepurchaseCommission,
  handleConsistencyBonus,
  handleAdvanceConsistency,
  allocateFund,
} = require("./incomeHandlers");
const moment = require("moment");

// Generate a unique 11-digit order number
const generateUniqueOrderNumberforcashondelivery = async () => {
  let orderNumber;
  let isUnique = false;
  while (!isUnique) {
    orderNumber = Math.floor(10000000000 + Math.random() * 90000000000);
    const existing = await CashOnDeliveryModel.findOne({ orderNumber });
    if (!existing) isUnique = true;
  }
  return orderNumber;
};

// Decide if the sector is "ProductPurchase" or "repurchase"
const decideFinalSector = (buyer) => {
  const hasPreviousProductPurchase = buyer.AllEntry?.incoming?.some(
    (entry) => entry.sector === "ProductPurchase"
  );
  return hasPreviousProductPurchase ? "repurchase" : "ProductPurchase";
};

// Check last 4 months to decide if user deserves consistency bonus
const checkAndApplyConsistencyBonus = (buyer, currentPV, product) => {
  const entries = buyer.AllEntry?.incoming || [];
  const purchaseEntries = entries.filter((e) =>
    ["ProductPurchase", "repurchase"].includes(e.sector)
  );

  const lastFourMonths = [];
  for (let i = 0; i < 4; i++) {
    const start = moment().subtract(i, "months").startOf("month");
    const end = moment().subtract(i, "months").endOf("month");
    lastFourMonths.push({ start, end });
  }

  let isConsistent = true;
  for (const { start, end } of lastFourMonths) {
    const monthlyPV = purchaseEntries
      .filter((e) => moment(e.date).isBetween(start, end, undefined, "[]"))
      .reduce((sum, e) => sum + (e.pointReceived || 0), 0);

    if (monthlyPV < 2000) {
      isConsistent = false;
      break;
    }
  }

  // If user was consistent, add bonus
  if (isConsistent) {
    const bonus = Math.floor(currentPV * 0.1);
    buyer.points += bonus;
    buyer.AllEntry.incoming.push({
      fromUser: buyer._id,
      name: buyer.name,
      sector: "consistency-bonus",
      email: buyer.email,
      pointReceived: bonus,
      product: product?.name,
      type: "consistency-bonus",
      date: new Date(),
    });
  }
};


const updatecashondelivery = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid delivery ID" });
    }

    const updateData = req.body;

    // console.log("delivery id:", id);
    // console.log("update data:", updateData);

    const existingOrder = await CashOnDeliveryModel.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const wasPending = existingOrder.status !== "shipped" && updateData.status === "shipped";

    const updatedOrder = await CashOnDeliveryModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (wasPending && updateData.status === "shipped") {
      const { PV, product } = updatedOrder;
      const buyer = await User.findById(updatedOrder?.userId);
      if (!buyer) return res.status(404).json({ message: "Buyer not found" });
      // console.log("buyer data----------------", buyer)

      // Initialize AllEntry arrays if missing
      buyer.AllEntry = buyer.AllEntry || {};
      buyer.AllEntry.incoming = Array.isArray(buyer.AllEntry.incoming) ? buyer.AllEntry.incoming : [];
      buyer.AllEntry.outgoing = Array.isArray(buyer.AllEntry.outgoing) ? buyer.AllEntry.outgoing : [];

      buyer.points = (buyer.points || 0) + PV;

      if (buyer.referredBy) {
        const referrer = await User.findOne({ referralCode: buyer.referredBy });
        // console.log("referred data -----------", referrer)

        if (referrer) {
          referrer.AllEntry = referrer.AllEntry || {};
          referrer.AllEntry.incoming = Array.isArray(referrer.AllEntry.incoming) ? referrer.AllEntry.incoming : [];
          referrer.AllEntry.outgoing = Array.isArray(referrer.AllEntry.outgoing) ? referrer.AllEntry.outgoing : [];

          const reward = Math.floor(PV * 0.1);
          referrer.points = (referrer.points || 0) + reward;

          referrer.AllEntry.incoming.push({
            fromUser: buyer._id,
            name: buyer.name,
            sector: "ProductPurchase",
            email: buyer.email,
            pointReceived: reward,
            product: product?.name || "",
            type: "referral",
            date: new Date(),
          });

          buyer.AllEntry.outgoing.push({
            toUser: referrer._id,
            name: referrer.name,
            sector: "ProductPurchase",
            email: referrer.email,
            pointGiven: reward,
            product: product?.name || "",
            type: "referral",
            date: new Date(),
          });

          // Save referrer and log
          try {
            await referrer.save();
            // console.log("Referrer saved successfully:", referrer);
          } catch (err) {
            console.error("Error saving referrer:", err);
          }

          const remaining = PV - reward;
          if (remaining > 0) {
            buyer.AllEntry.incoming.push({
              fromUser: buyer._id,
              name: buyer.name,
              sector: "ProductPurchase",
              email: buyer.email,
              pointReceived: remaining,
              product: product?.name || "",
              type: "self-after-referral",
              date: new Date(),
            });
          }
        }
      } else {
        buyer.AllEntry.incoming.push({
          fromUser: buyer._id,
          name: buyer.name,
          email: buyer.email,
          sector: "ProductPurchase",
          pointReceived: PV,
          product: product?.name || "",
          type: "self-purchase",
          date: new Date(),
        });
      }

      // Save buyer and log
      try {
        await buyer.save();
        // console.log("Buyer saved successfully:", buyer);
      } catch (err) {
        console.error("Error saving buyer:", err);
      }
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      message: "Failed to update order",
      error: err.message,
    });
  }
};


// Handle POST order without processing income immediately
const CashonDeliverypost = async (req, res) => {
  try {
    const order = req.body;
    order.orderNumber = await generateUniqueOrderNumberforcashondelivery();
    order.status = "pending";
    order.orderTime = new Date();

    const result = await CashOnDeliveryModel.create(order);
    await result.save();

    res.status(201).json({
      message: "Order placed and income logic processed",
      result,
    });
  } catch (err) {
    console.error("CashOnDelivery error:", err);
    res.status(500).json({
      message: "Failed to place order",
      error: err.message,
    });
  }
};

// Return all orders (admin/debug route)
const getCashonDelivery = async (req, res) => {
  try {
    const orders = await CashOnDeliveryModel.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error("Fetch error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};

const userBasedCashonDelivery = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await CashOnDeliveryModel.find({ userId: ObjectId(userId) });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.status(200).json(orders);
  } catch (err) {
    console.error("User-based fetch error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch user orders", error: err.message });
  }
};

module.exports = {
  getCashonDelivery,
  CashonDeliverypost,
  updatecashondelivery,
  userBasedCashonDelivery,
};
