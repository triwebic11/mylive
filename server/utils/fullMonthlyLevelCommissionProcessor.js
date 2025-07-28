const moment = require('moment');
const mongoose = require('mongoose');
const User = require('../models/User');

const POSITIONS = [
  { name: "Executive Officer", PV: 15000, generationLevel: 10, megaGenerationLevel: 3, benefit: { type: "product", fund: "free Product", value: 5000 }},
  { name: "Executive Manager", PV: 30000, generationLevel: 15, megaGenerationLevel: 3, benefit: { type: "fund", fund: "Special Fund", percent: 0.03 }},
  { name: "Executive Director", PV: 60000, generationLevel: 20, megaGenerationLevel: 4, benefit: { type: "fund", fund: "Travel Fund", percent: 0.04 }},
  { name: "Diamond Director", PV: 150000, generationLevel: 20, megaGenerationLevel: 4, benefit: { type: "fund", fund: "Car Fund", percent: 0.04 }},
  { name: "Crown Director", PV: 300000, generationLevel: Infinity, megaGenerationLevel: Infinity, benefit: { type: "House fund", fund: "houseFund", percent: 0.03 }},
  { name: "Crown Ambassador", PV: 1200000, generationLevel: Infinity, megaGenerationLevel: Infinity, benefit: { type: "All life fund", fund: "lifetimeBonus", percent: 0.01 }},
];

const isPackageActive = (user) => {
  return user?.packageExpireDate && new Date(user.packageExpireDate) > new Date();
};

const getDownlineTree = async (usersMap, rootId, level = 1, maxLevel = 9, tree = []) => {
  for (let [id, user] of usersMap.entries()) {
    if (user?.referredByUser?.toString() === rootId.toString()) {
      tree.push({ user, level });
      if (level < maxLevel) {
        await getDownlineTree(usersMap, user._id, level + 1, maxLevel, tree);
      }
    }
  }
  return tree;
};

async function processMonthlyUserRankAndFunds() {
  const allUsers = await User.find({});
  const usersMap = new Map(allUsers.map(u => [u._id.toString(), u]));
  const currentMonth = new Date().getMonth();

  for (const rootUser of allUsers) {
    if (!rootUser || !isPackageActive(rootUser) || rootUser.points <= 0) {
      continue;
    }

    const downlines = await getDownlineTree(usersMap, rootUser._id);
    let leftPV = 0, rightPV = 0;

    for (const { user: downUser } of downlines) {
      if (!downUser || !isPackageActive(downUser)) continue;

      const monthlyPV = (downUser.AllEntry?.incoming || [])
        .filter(e => {
          const d = new Date(e.date);
          return d.getMonth() === currentMonth && e.type === 'self-purchase';
        })
        .reduce((sum, e) => sum + (e.pointReceived || 0), 0);

      if (monthlyPV > 0) {
        const side = parseInt(downUser._id.toString().slice(-1)) % 2 === 0 ? 'left' : 'right';
        if (side === 'left') leftPV += monthlyPV;
        else rightPV += monthlyPV;
        // console.log(`📌 Downline: ${downUser.name} (Level: ${level}) | PV: ${monthlyPV} | Side: ${side}`);
      }
    }

    if (!rootUser.TargetPV) rootUser.TargetPV = [];
    rootUser.TargetPV.push({
      month: moment().format('MMMM-YYYY'),
      leftPV,
      rightPV,
      date: new Date()
    });

    // console.log(`\n🔎 ${rootUser.name} | LeftPV: ${leftPV}, RightPV: ${rightPV}`);

    for (const pos of POSITIONS) {
      if (leftPV >= pos.PV && rightPV >= pos.PV) {
        if (rootUser.Position !== pos.name) {
          rootUser.Position = pos.name;
          rootUser.GenerationLevel = pos.generationLevel;
          rootUser.MegaGenerationLevel = pos.megaGenerationLevel;

          if (pos.benefit.type === 'product') {
            rootUser.points += pos.benefit.value;
            rootUser.AllEntry.incoming.push({
              fromUser: 'System',
              name: 'Rank Bonus',
              pointReceived: pos.benefit.value,
              product: pos.name,
              sector: pos.benefit.fund,
              type: 'rank-product',
              date: new Date()
            });
            // console.log(`🎉 ${rootUser.name} got Product Bonus: ${pos.benefit.value} PV for ${pos.name}`);
          } else if (pos.benefit.type === 'fund') {
            const fundAmount = Math.floor((leftPV + rightPV) * pos.benefit.percent);
            if (!rootUser.funds) rootUser.funds = {};
            rootUser.funds[pos.benefit.fund] = (rootUser.funds[pos.benefit.fund] || 0) + fundAmount;

            rootUser.AllEntry.incoming.push({
              fromUser: 'System',
              name: 'Fund Bonus',
              pointReceived: fundAmount,
              product: pos.name,
              sector: pos.benefit.fund,
              type: pos.benefit.fund,
              date: new Date()
            });
            // console.log(`🏦 ${rootUser.name} got Fund Bonus: ${fundAmount} PV to ${pos.benefit.fund}`);
          }
        }
        break;
      }
    }

    await rootUser.save();
    // console.log(`✅ Updated: ${rootUser.name} (${rootUser.email})`);
  }

  // console.log('\n🎉 All users processed for Rank, PV & Funds.');
}

module.exports = { processMonthlyUserRankAndFunds };
