// Required modules and models
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
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
    entry => entry.sector === "ProductPurchase"
  );
  return hasPreviousProductPurchase ? "repurchase" : "ProductPurchase";
};

// Check last 4 months to decide if user deserves consistency bonus
const checkAndApplyConsistencyBonus = (buyer, currentPV, product) => {
  const entries = buyer.AllEntry?.incoming || [];
  const purchaseEntries = entries.filter(e =>
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
      .filter(e => moment(e.date).isBetween(start, end, undefined, "[]"))
      .reduce((sum, e) => sum + (e.pointReceived || 0), 0);

    if (monthlyPV < 2000) {
      isConsistent = false;
      break;
    }
  }

  // If user was consistent, add bonus
  if (isConsistent) {
    const bonus = Math.floor(currentPV * 0.10);
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

// Update order status and handle all income logic
const updatecashondelivery = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    // console.log("user id data ",id)

    // Fetch the existing order
    const existingOrder = await CashOnDeliveryModel.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Determine if order transitioned to 'shipped'
    const wasPending = existingOrder.status !== "shipped" && updateData.status === "shipped";
    const updatedOrder = await CashOnDeliveryModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (wasPending && updateData.status === "shipped") {
      const { PV, product } = updatedOrder;
      const buyer = await User.findById(updatedOrder.userId);
      if (!buyer) return res.status(404).json({ message: "Buyer not found" });

      if (!buyer.AllEntry) buyer.AllEntry = { incoming: [], outgoing: [] };
      buyer.points += PV;

      const finalSector = decideFinalSector(buyer);
      const userSectors = buyer.sectors || {};

      // ➤ Referral reward logic
      if (buyer.referredBy) {
        const referrer = await User.findOne({ referralCode: buyer.referredBy });
        if (referrer) {
          if (!referrer.AllEntry) referrer.AllEntry = { incoming: [], outgoing: [] };

          const reward = Math.floor(PV * 0.10);
          referrer.points += reward;

          // Referrer gets incoming
          referrer.AllEntry.incoming.push({
            fromUser: buyer._id,
            name: buyer.name,
            sector: finalSector,
            email: buyer.email,
            pointReceived: reward,
            product: product?.name,
            type: "referral",
            date: new Date(),
          });

          // Buyer logs outgoing
          buyer.AllEntry.outgoing.push({
            toUser: referrer._id,
            name: referrer.name,
            sector: finalSector,
            email: referrer.email,
            pointGiven: reward,
            product: product?.name,
            type: "referral",
            date: new Date(),
          });

          await referrer.save();

          // Buyer gets remaining
          const remaining = PV - reward;
          if (remaining > 0) {
            buyer.AllEntry.incoming.push({
              fromUser: buyer._id,
              name: buyer.name,
              sector: finalSector,
              email: buyer.email,
              pointReceived: remaining,
              product: product?.name,
              type: "self-after-referral",
              date: new Date(),
            });
          }
        }
      } else {
        // No referral → all PV to buyer
        buyer.AllEntry.incoming.push({
          fromUser: buyer._id,
          name: buyer.name,
          email: buyer.email,
          sector: finalSector,
          pointReceived: PV,
          product: product?.name,
          type: finalSector === "repurchase" ? "repurchase" : "self-purchase",
          date: new Date(),
        });
      }

      // ➤ Dynamic sector activation check
      const activeSectors = [];
      if (finalSector === "repurchase" && userSectors.repurchase) activeSectors.push("repurchase");
      if (userSectors.consistency) activeSectors.push("consistency");
      if (userSectors.advanceConsistency) activeSectors.push("advance-consistency");
      if (userSectors.travel) activeSectors.push("travel");
      if (userSectors.car) activeSectors.push("car");
      if (userSectors.house) activeSectors.push("house");
      if (userSectors.dsp) activeSectors.push("dsp");

      // ➤ Process active income handlers
      for (const sectorType of activeSectors) {
        switch (sectorType) {
          case "repurchase":
            await handleRepurchaseCommission(buyer, PV, product, finalSector);
            break;
          case "consistency":
            checkAndApplyConsistencyBonus(buyer, PV, product);
            break;
          case "advance-consistency":
            await handleAdvanceConsistency(buyer, PV, product);
            break;
          case "travel":
            await allocateFund(buyer, PV, "travelFund", 0.04);
            break;
          case "car":
            await allocateFund(buyer, PV, "carFund", 0.04);
            break;
          case "house":
            await allocateFund(buyer, PV, "houseFund", 0.02);
            break;
          case "dsp":
            await allocateFund(buyer, PV, "dsp", 0.15);
            break;
        }
      }

      await buyer.save();
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update order", error: err.message });
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
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

module.exports = {
  getCashonDelivery,
  CashonDeliverypost,
  updatecashondelivery,
};
