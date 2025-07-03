const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const User = require("../models/User");
const CashOnDeliveryModel = require("../models/CashOnDeliveryModel");

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

// POST cash on delivery with referral update
// ✅ POST Cash on Delivery Order
const CashonDeliverypost = async (req, res) => {
  try {
    const order = req.body;
    const { email, PV, product } = order;
    console.log("order come",order)

    // Create unique order number
    const orderNumber = await generateUniqueOrderNumberforcashondelivery();
    order?.orderNumber = orderNumber;

    // Save order
    const result = await CashOnDeliveryModel.create(order);

    // Get Buyer
    const buyer = await User.findOne({ email });
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    // Add points to buyer
    buyer.points += PV;

    // Initialize AllEntry if not exists
    if (!buyer.AllEntry) {
      buyer.AllEntry = { incoming: [], outgoing: [] };
    }

    // If buyer has referredBy, reward the referrer
    if (buyer.referredBy) {
      const referrer = await User.findOne({ referralCode: buyer.referredBy });

      if (referrer) {
        const reward = Math.floor(PV * 0.1); // 10% reward

        // Add reward points to referrer
        referrer.points += reward;

        // Initialize AllEntry if not exists
        if (!referrer.AllEntry) {
          referrer.AllEntry = { incoming: [], outgoing: [] };
        }

        // ✅ Log to referrer's incoming
        referrer.AllEntry.incoming.push({
          fromUser: buyer._id,
          name: buyer.name,
          email: buyer.email,
          pointReceived: reward,
          product: product?.name || "Unknown Product",
          date: new Date(),
        });

        // ✅ Log to buyer's outgoing
        buyer.AllEntry.outgoing.push({
          toUser: referrer._id,
          name: referrer.name,
          email: referrer.email,
          pointGiven: reward,
          product: product?.name || "Unknown Product",
          date: new Date(),
        });

        await referrer.save();
      }
    }

    await buyer.save();

    res.status(201).json({
      message: "Order placed and referral points distributed",
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

const getCashonDelivery = async (req, res) => {
  try {
    const orders = await CashOnDeliveryModel.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

const updatecashondelivery = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const result = await CashOnDeliveryModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update order", error: err.message });
  }
};

module.exports = {
  getCashonDelivery,
  CashonDeliverypost,
  updatecashondelivery,
};