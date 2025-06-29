// server/utils/distributeCommission.js

const User = require("../models/User");

const commissionRates = {
  Platinum: [
    20, 10, 5, 3, 2, 2, 2, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    0.5,
  ],
  Gold: [15, 8, 5, 3, 2, 1, 1, 1, 0.5, 0.5],
  Silver: [10, 5, 2, 1],
  Normal: [5, 2],
};

const distributeCommission = async (userId, amount) => {
  const buyer = await User.findById(userId);
  if (!buyer) return;

  const buyerPackage = buyer.package?.name || "Normal";
  const rates = commissionRates[buyerPackage] || [];

  let currentUser = buyer;
  for (let level = 0; level < rates.length; level++) {
    const referredBy = currentUser.referredBy;
    if (!referredBy) break;

    const upline = await User.findOne({ referralCode: referredBy });
    if (!upline) break;

    const commissionAmount = (amount * rates[level]) / 100;

    if (commissionAmount > 0) {
      await User.findByIdAndUpdate(upline._id, {
        $inc: { points: commissionAmount },
      });

      // Emit real-time socket update
      global.io?.to(upline._id.toString()).emit("points-updated", {
        points: commissionAmount,
        level: level + 1,
        fromUser: buyer._id,
      });
    }

    currentUser = upline;
  }
};

module.exports = distributeCommission;
