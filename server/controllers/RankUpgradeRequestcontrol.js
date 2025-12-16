const RankUpgradeRequest = require("../models/RankUpgradeRequest");
const User = require("../models/User");

exports.getRanksRequest = async (req, res) => {
  try {
    const requests = await RankUpgradeRequest.find().sort({ createdAt: -1 });

    // console.log("Fetched Rank Upgrade Requests:", requests);
    res.json(requests);
  } catch (error) {
    console.error("Error fetching rank update requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rank update requests",
      error: error.message,
    });
  }
};

exports.RankUpdateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // console.log("Updating Rank Upgrade Request:", id, "to status:", status);

    const updated = await RankUpgradeRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Rank request not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating rank status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};

async function buildTree(userId) {
  const user = await User.findById(userId);
  if (!user) return null;

  // 1) Children load
  const children = await User.find({
    $or: [
      { placementBy: user.referralCode },
      { referredBy: user.referralCode },
    ],
  });

  const childrenTrees = await Promise.all(
    children.map((child) => buildTree(child._id))
  );

  const leftChild = childrenTrees[0] || null;
  const rightChild = childrenTrees[1] || null;

  // 2) Recursive total point calculation (lifetime points)
  const calculateTotalPoints = (node) => {
    if (!node) return 0;
    const selfPoints = node.points || 0;
    const leftPoints = calculateTotalPoints(node.left);
    const rightPoints = calculateTotalPoints(node.right);
    return selfPoints + leftPoints + rightPoints;
  };

  

  // 3) Monthly incoming sum (ONLY current month for one user)
  const getMonthlyIncoming = async (id) => {
    const u = await User.findById(id);
    if (!u?.AllEntry?.incoming) return 0;

    let total = 0;
    const now = new Date();

    for (const entry of u.AllEntry.incoming) {
      const entryDate = new Date(entry.date);

      // ✅ শুধু এই মাস ও বছরের income হিসাব হবে
      if (
        entryDate.getMonth() === now.getMonth() &&
        entryDate.getFullYear() === now.getFullYear()
      ) {
        total += entry.grandpoints;
      }
    }
    return total;
  };

  const getTotalIncoming = async (id) => {
    const u = await User.findById(id);
    if (!u?.AllEntry?.incoming) return 0;

    let total = 0;

    for (const entry of u.AllEntry.incoming) {
      // ✅ সব entry-এর grandpoints যোগ করা হচ্ছে (month/year condition বাদ)
      total += Number(entry.grandpoints || 0);
    }

    return total;
  };


  // 4) শুধু সরাসরি leftChild আর rightChild এর monthly income
  const monthlyleftBV = leftChild ? await getMonthlyIncoming(leftChild._id) : 0;
  const monthlyrightBV = rightChild ? await getMonthlyIncoming(rightChild._id) : 0;
  const totalPointsFromLeft = leftChild ? await getTotalIncoming(leftChild._id) : 0;
  const totalPointsFromRight = rightChild ? await getTotalIncoming(rightChild._id) : 0;

  // 5) Return structured tree
  return {
    name: user.name,
    _id: user._id,
    Position: user.Position,
    phone: user.phone,
    referralCode: user.referralCode,
    referredBy: user.referredBy,
    placementBy: user.placementBy,
    points: user.points || 0,
    left: leftChild,
    right: rightChild,
    monthlyleftBV,      // ✅ শুধু এক লেভেল left
    monthlyrightBV,     // ✅ শুধু এক লেভেল right
    totalPointsFromLeft,
    totalPointsFromRight,
  };
}



const positionLevels = [
  {
    rank: 1,
    leftPV: 5,
    rightPV: 5,
    leftBV: 30000,
    rightBV: 30000,
    position: "Executive Officer",
    reward: "Frying Pan",
    generationLevel: 10,
    megaGenerationLevel: 3,
  },
  {
    rank: 2,
    leftPV: 15,
    rightPV: 15,
    leftBV: 90000,
    rightBV: 90000,
    position: "Executive Manager",
    reward: "Rice Cooker",
    generationLevel: 15,
    megaGenerationLevel: 3,
  },
  {
    rank: 3,
    leftPV: 50,
    rightPV: 50,
    leftBV: 300000,
    rightBV: 300000,
    position: "Executive Director",
    reward: "Inani Tour or ৳10,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 4,
    leftPV: 120,
    rightPV: 120,
    leftBV: 720000,
    rightBV: 720000,
    position: "Executive Pal Director",
    reward: "Cox’s Bazar Tour",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 5,
    leftPV: 220,
    rightPV: 220,
    leftBV: 1320000,
    rightBV: 1320000,
    position: "Executive Total Director",
    reward: "Laptop or ৳30,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 6,
    leftPV: 500,
    rightPV: 500,
    leftBV: 3000000,
    rightBV: 3000000,
    position: "Executive Emerald",
    reward: "Bike or ৳50,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 7,
    leftPV: 1000,
    rightPV: 1000,
    leftBV: 6000000,
    rightBV: 6000000,
    position: "Executive Elite",
    reward: "Thailand Tour or ৳1,25,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 8,
    leftPV: 2000,
    rightPV: 2000,
    leftBV: 12000000,
    rightBV: 12000000,
    position: "Executive Deluxe",
    reward: "Hajj/Umrah or ৳3,00,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 9,
    leftPV: 4000,
    rightPV: 4000,
    leftBV: 24000000,
    rightBV: 24000000,
    position: "Executive Marjury",
    reward: "Car or ৳6,00,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 10,
    leftPV: 8000,
    rightPV: 8000,
    leftBV: 48000000,
    rightBV: 48000000,
    position: "Diamond Director",
    reward: "Car or ৳13,00,000 cash",
    generationLevel: 20,
    megaGenerationLevel: 4,
  },
  {
    rank: 11,
    leftPV: 16000,
    rightPV: 16000,
    leftBV: 96000000,
    rightBV: 96000000,
    position: "Double Diamond",
    reward: "Private Car or ৳25,00,000 cash",
    generationLevel: Infinity, // From PDF: Unlimited
    megaGenerationLevel: Infinity,
  },
  {
    rank: 12,
    leftPV: 24000,
    rightPV: 24000,
    leftBV: 144000000,
    rightBV: 144000000,
    position: "Crown Director",
    reward: "৳50,00,000 cash",
    generationLevel: Infinity,
    megaGenerationLevel: Infinity,
  },
  {
    rank: 13,
    leftPV: 37000,
    rightPV: 37000,
    leftBV: 222000000,
    rightBV: 222000000,
    position: "Star Crown",
    reward: "Mansion or ৳1 crore cash",
    generationLevel: Infinity,
    megaGenerationLevel: Infinity,
  },
  {
    rank: 14,
    leftPV: 50000,
    rightPV: 50000,
    leftBV: 300000000,
    rightBV: 300000000,
    position: "Universal Crown",
    reward: "৳5 crore cash or Villa",
    generationLevel: Infinity,
    megaGenerationLevel: Infinity,
  },
];

exports.UpdateRanksAndRewards = async (buyer) => {
  try {
    const tree = await buildTree(buyer._id);
    if (!tree) return;

    const leftBV = Number(tree?.totalPointsFromLeft || 0);
    const rightBV = Number(tree?.totalPointsFromRight || 0);


    // console.log("Left Tree:", tree);
    // console.log("Right Tree:", rightBV);
    const matchedRank = positionLevels
      .slice()
      .reverse()
      .find((level) => leftBV >= level.leftBV && rightBV >= level.rightBV);

    // console.log("Matched Rank:", matchedRank);


    // if (!matchedRank) return;

    const user = await User.findById(buyer._id);
    // console.log("User Current Position:", user?.Position);

    // // Update if new position is higher than existing
    const currentRankIndex = positionLevels.findIndex(
      (r) => r.position === user.Position
    );
    const newRankIndex = positionLevels.findIndex(
      (r) => r.position === matchedRank.position
    );

    // console.log("Current Rank Index:", currentRankIndex);
    // console.log("New Rank Index:", newRankIndex);

    if (newRankIndex > currentRankIndex) {
      // console.log(`🔄 Upgrading user ${user._id} from ${user.Position} to ${matchedRank.position}`);
      // user.Position = matchedRank.position;
      user.RewardPosition = matchedRank.position;
      user.rewards = matchedRank.reward;
      user.GenerationLevel = matchedRank.generationLevel;
      user.MegaGenerationLevel = matchedRank.megaGenerationLevel;
      // if (user.isActivePackage === "expire" || user.isActivePackage === "In Active") {
      // user.isActivePackage = "active";
      // 30 din er expire date
      // const expireDate = new Date();
      // expireDate.setDate(expireDate.getDate() + 30);
      // user.packageExpireDate = expireDate;

      // console.log(`✅ User ${user._id} re-activated. New expire date: ${user.packageExpireDate}`);
      // }

      if (!user.rewards?.includes(matchedRank?.reward)) {
        user.rewards = Array.isArray(user.rewards)
          ? [...user.rewards, matchedRank.reward]
          : [matchedRank.reward];

      }

      await user.save();

      // console.log("✅ Ready to post rank upgrade...");


      // Save to RankUpgradeRequest
      const postrank = await RankUpgradeRequest.create({
        userId: user._id,
        name: user.name,
        phone: user.phone,
        previousPosition: positionLevels[currentRankIndex]?.position || null,
        newPosition: matchedRank.position,
        reward: matchedRank.reward,
        leftBV,
        rightBV,
        status: "pending",
      });

      // console.log("Rank upgrade request created:", postrank);
      // console.log(
      //   `✅ Rank upgrade request saved for ${user.name} to ${matchedRank.position}`
      // );
      // console.log(
      //   `✅ User ${user._id} upgraded to ${matchedRank.position} with reward: ${matchedRank.reward}`
      // );
    }
  } catch (error) {
    console.error("❌ Error updating ranks and rewards:", error);
  }
};
