const User = require("../models/User");
const generationLimitByPackage = require("./generationLimitByPackage");

const distributeReferralCommission = async (userId, totalAmount) => {
  const user = await User.findById(userId);
  if (!user) return;

  let currentUser = user;
  let level = 1;

  while (currentUser.referredBy && level <= 20) {
    const parent = await User.findById(currentUser.referredBy);
    if (!parent) break;

    const isActive =
      parent.package &&
      (!parent.packageExpireDate || parent.packageExpireDate > new Date());

    const maxGen = generationLimitByPackage(parent.package);
    if (!isActive || level > maxGen) break;

    // Example commission calculation:
    const commission = totalAmount * 0.01; // 1% per level
    parent.balance = (parent.balance || 0) + commission;
    await parent.save();

    currentUser = parent;
    level++;
  }
};

module.exports = distributeReferralCommission;
