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
    const { email, PV, product,sector } = order;

    console.log("Order Received:", order);

    // Create Unique Order Number
    const orderNumber = await generateUniqueOrderNumberforcashondelivery();
    order.orderNumber = orderNumber;

    console.log("ordernumber", orderNumber)

    // Save Order
    const result = await CashOnDeliveryModel.create(order);
    console.log("result", result)


    // Find Buyer
    const buyer = await User.findOne({ email });
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    console.log("buyeerrrrr", buyer)

    // Add full PV to buyer's total points
    buyer.points += PV;

    if (!buyer.AllEntry) {
      buyer.AllEntry = { incoming: [], outgoing: [] };
    }

    // ReferredBy থাকলে referrer কে খুঁজে বের করো
    if (buyer.referredBy) {
      const referrer = await User.findOne({ referralCode: buyer.referredBy });

      if (referrer) {
        const reward = Math.floor(PV * 0.10); // ১০% referrer কে

        // Referrer কে points দিন
        referrer.points += reward;

        if (!referrer.AllEntry) {
          referrer.AllEntry = { incoming: [], outgoing: [] };
        }

        // ✅ Referrer's incoming log
        referrer.AllEntry.incoming.push({
          fromUser: buyer._id,
          name: buyer.name,
          sector: sector,
          email: buyer.email,
          pointReceived: reward,
          product: product?.name || "Unknown Product",
          type: "referral",
          date: new Date(),
        });

        // ✅ Buyer's outgoing log (to referrer)
        buyer.AllEntry.outgoing.push({
          toUser: referrer._id,
          name: referrer.name,
          sector: sector,
          email: referrer.email,
          pointGiven: reward,
          product: product?.name || "Unknown Product",
          type: "referral",
          date: new Date(),
        });

        await referrer.save();

        // ✅ Buyer's incoming log (remaining 90%)
        const remaining = PV - reward;
        if (remaining > 0) {
          buyer.AllEntry.incoming.push({
            fromUser: buyer._id,
            name: buyer.name,
            sector: sector,
            email: buyer.email,
            pointReceived: remaining,
            product: product?.name || "Unknown Product",
            type: "self-after-referral",
            date: new Date(),
          });
        }

      } else {
        // referrer not found → full PV goes to buyer incoming
        buyer.AllEntry.incoming.push({
          fromUser: buyer._id,
          name: buyer.name,
          sector: buyer.sector,
          email: buyer.email,
          pointReceived: PV,
          product: product?.name || "Unknown Product",
          type: "self-purchase",
          date: new Date(),
        });
      }
    } else {
      // No referredBy → full PV goes to buyer
      buyer.AllEntry.incoming.push({
        fromUser: buyer._id,
        name: buyer.name,
        email: buyer.email,
        pointReceived: PV,
        product: product?.name || "Unknown Product",
        type: "self-purchase",
        date: new Date(),
      });
    }


    await buyer.save(); // Save buyer

    res.status(201).json({
      message: "Order placed and referral reward distributed",
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