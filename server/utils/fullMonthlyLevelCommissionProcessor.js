// MongoDB এবং User মডেল ইমপোর্ট
const mongoose = require("mongoose");
const User = require("../models/User");

// 🧮 Level Commission রেট (প্রতিটি লেভেল অনুযায়ী কমিশন পার্সেন্ট)
const LEVEL_COMMISSION = {
  general: {
    1: 0.10,
    2: 0.08,
    3: 0.06,
    4: 0.03,
    5: 0.02,
    6: 0.01,
  },
  mega: {
    7: 0.04,
    8: 0.02,
    9: 0.01,
  }
};

// 🎖 Designation অনুযায়ী Target PV, Level, Fund ও Bonus
const POSITIONS = [
  {
    name: "Executive Officer",
    PV: 15000,
    generationLevel: 10,
    megaGenerationLevel: 3,
    benefit: { type: "product", value: 5000 },
  },
  {
    name: "Executive Manager",
    PV: 30000,
    generationLevel: 15,
    megaGenerationLevel: 3,
    benefit: { type: "fund", fund: "specialFund", percent: 0.03 },
  },
  {
    name: "Executive Director",
    PV: 60000,
    generationLevel: 20,
    megaGenerationLevel: 4,
    benefit: { type: "fund", fund: "travelFund", percent: 0.04 },
  },
  {
    name: "Diamond Director",
    PV: 150000,
    generationLevel: 20,
    megaGenerationLevel: 4,
    benefit: { type: "fund", fund: "carFund", percent: 0.04 },
  },
  {
    name: "Crown Director",
    PV: 300000,
    generationLevel: Infinity,
    megaGenerationLevel: Infinity,
    benefit: { type: "fund", fund: "houseFund", percent: 0.03 },
  },
  {
    name: "Crown Ambassador",
    PV: 1200000,
    generationLevel: Infinity,
    megaGenerationLevel: Infinity,
    benefit: { type: "fund", fund: "lifetimeBonus", percent: 0.01 },
  },
];

// 🔁 রিকার্সিভলি ডাউনলাইন ট্রি তৈরির ফাংশন
const getDownlineTree = async (usersMap, rootId, level = 1, maxLevel = 9, tree = []) => {
  for (let [id, user] of usersMap.entries()) {
    if (user.referredByUser?.toString() === rootId.toString()) {
      tree.push({ user, level });
      if (level < maxLevel) {
        await getDownlineTree(usersMap, user._id, level + 1, maxLevel, tree);
      }
    }
  }
  return tree;
};

// 🏁 মূল ফাংশন: মাস শেষে লেভেল কমিশন এবং Designation প্রসেস
const processMonthlyLevelCommissions = async () => {
  const allUsers = await User.find({});
  const usersMap = new Map(allUsers.map(u => [u._id.toString(), u]));
  const currentMonth = new Date().getMonth();

  for (const rootUser of allUsers) {
    const downlines = await getDownlineTree(usersMap, rootUser._id);
    let totalPV = 0;
    let leftPV = 0;
    let rightPV = 0;

    for (const { user: downUser, level } of downlines) {
      const monthlyPV = (downUser.AllEntry?.incoming || []).filter(entry => {
        const d = new Date(entry.date);
        return d.getMonth() === currentMonth && entry.type === "self-purchase";
      }).reduce((sum, entry) => sum + entry.pointReceived, 0);

      if (monthlyPV <= 0) continue;

      totalPV += monthlyPV;

      const side = downUser._id.toString().slice(-1) % 2 === 0 ? "left" : "right";
      if (side === "left") leftPV += monthlyPV;
      else rightPV += monthlyPV;

      let commissionRate = 0;
      let type = "";
      let sector = "";

      if (LEVEL_COMMISSION.general[level]) {
        commissionRate = LEVEL_COMMISSION.general[level];
        type = "generation-level";
        sector = "monthly-general";
      } else if (LEVEL_COMMISSION.mega[level]) {
        commissionRate = LEVEL_COMMISSION.mega[level];
        type = "mega-generation-level";
        sector = "monthly-mega";
      }

      if (commissionRate > 0) {
        const commission = Math.floor(monthlyPV * commissionRate);
        if (commission > 0) {
          if (!rootUser.AllEntry) rootUser.AllEntry = { incoming: [], outgoing: [] };
          rootUser.points += commission;
          rootUser.AllEntry.incoming.push({
            fromUser: downUser._id,
            name: downUser.name,
            email: downUser.email,
            pointReceived: commission,
            product: `Level ${level} Income`,
            sector,
            type,
            level,
            date: new Date(),
          });
        }
      }
    }

    // ✅ Designation assignment with bonus, level, fund
    for (const pos of POSITIONS) {
      if (leftPV >= pos.PV && rightPV >= pos.PV) {
        if (rootUser.Position !== pos.name) {
          rootUser.Position = pos.name;
          rootUser.GenerationLevel = pos.generationLevel;
          rootUser.MegaGenerationLevel = pos.megaGenerationLevel;

          if (!rootUser.AllEntry) rootUser.AllEntry = { incoming: [], outgoing: [] };

          if (pos.benefit.type === "product") {
            rootUser.points += pos.benefit.value;
            rootUser.AllEntry.incoming.push({
              fromUser: "System",
              name: "Free Product Bonus",
              email: rootUser.email,
              pointReceived: pos.benefit.value,
              product: pos.name,
              sector: "designation-bonus",
              type: "product-bonus",
              level: 0,
              date: new Date(),
            });
          } else if (pos.benefit.type === "fund") {
            const fundAmount = Math.floor(totalPV * pos.benefit.percent);
            if (!rootUser.funds) rootUser.funds = {};
            if (!rootUser.funds[pos.benefit.fund]) rootUser.funds[pos.benefit.fund] = 0;
            rootUser.funds[pos.benefit.fund] += fundAmount;

            rootUser.AllEntry.incoming.push({
              fromUser: "System",
              name: "Rank Fund Bonus",
              email: rootUser.email,
              pointReceived: fundAmount,
              product: pos.name,
              sector: "designation-bonus",
              type: "rank-fund",
              level: 0,
              date: new Date(),
            });
          }
        }
        break;
      }
    }

    await rootUser.save();
  }

  console.log("✅ Full monthly level-based commission & designation processed.");
};

module.exports = { processMonthlyLevelCommissions };