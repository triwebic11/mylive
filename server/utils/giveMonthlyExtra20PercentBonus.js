import User from "../models/User.js"; // তোমার User মডেল
import mongoose from "mongoose";

const giveMonthlyExtra20PercentBonus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return console.log("❌ User not found");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const incoming = user.AllEntry?.incoming || [];

  // ✅ এই মাসে 20% কমিশন থেকে মোট পয়েন্ট কত পেয়েছে
  const monthlyCommissionEntries = incoming.filter((entry) => {
    const date = new Date(entry.date);
    return (
      entry.sector === "20% phone referrer commission" &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });

  const totalCommissionPoints = monthlyCommissionEntries.reduce(
    (sum, entry) => sum + (entry.pointReceived || 0),
    0
  );

  if (totalCommissionPoints <= 0) {
    console.log(`❌ ${user.name} এই মাসে 20% commission পায়নি`);
    return;
  }

  // ✅ এই মাসে আগেই বোনাস দেয়া হয়েছে কিনা চেক করা
  const alreadyGiven = incoming.some((entry) => {
    const date = new Date(entry.date);
    return (
      entry.sector === "Monthly 20% Bonus Commission" &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });

  if (alreadyGiven) {
    console.log(`ℹ️ ${user.name} already got this month’s 20% bonus.`);
    return;
  }

  // ✅ বোনাস হিসাব করা
  const bonusPoints = (totalCommissionPoints * 20) / 100;

  // ✅ ইউজারের incoming-এ নতুন এন্ট্রি যোগ করা
  user.AllEntry.incoming.push({
    sector: "Monthly 20% Bonus Commission",
    pointReceived: bonusPoints,
    amount: 0,
    description: `Earned 20% bonus on ${totalCommissionPoints} referrer commission points.`,
    date: new Date(),
  });

  // ✅ ইউজারের total points আপডেট করা
  user.points = (parseFloat(user.points) || 0) + bonusPoints;
  user.referSponsorbonus = (parseFloat(user.referSponsorbonus) || 0) + bonusPoints;

  await user.save();

  console.log(
    `✅ ${user.name} got ${bonusPoints.toFixed(2)} bonus points for ${currentMonth + 1}/${currentYear}`
  );
};

export const giveMonthlyExtraBonusToAll = async () => {
  const users = await User.find();
  for (const user of users) {
    await giveMonthlyExtra20PercentBonus(user._id);
  }
  console.log("🎉 Monthly 20% bonus check complete for all users!");
};

