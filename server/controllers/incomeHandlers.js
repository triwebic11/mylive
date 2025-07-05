async function handleRepurchaseCommission(buyer, PV, product, sector) {
  const commission = Math.floor(PV * 0.10);
  buyer.points += commission;
  if (!buyer.AllEntry) buyer.AllEntry = { incoming: [], outgoing: [] };

  buyer.AllEntry.incoming.push({
    fromUser: buyer._id,
    name: buyer.name,
    email: buyer.email,
    sector,
    pointReceived: commission,
    product: product?.name,
    type: "repurchase-commission",
    date: new Date(),
  });
}

async function handleConsistencyBonus(buyer, PV) {
  const bonus = Math.floor(PV * 0.10);
  buyer.points += bonus;
  buyer.AllEntry.incoming.push({
    fromUser: buyer._id,
    name: buyer.name,
    email: buyer.email,
    sector: "consistency",
    pointReceived: bonus,
    product: "Consistency Bonus",
    type: "consistency",
    date: new Date(),
  });
}

async function handleAdvanceConsistency(buyer, currentPV, product) {
  const entries = buyer.AllEntry?.incoming || [];

  // Filter only ProductPurchase or repurchase sectors
  const purchaseEntries = entries.filter(e =>
    ["ProductPurchase", "repurchase"].includes(e.sector)
  );

  // Get last 4 months range
  const lastFourMonths = [];
  for (let i = 0; i < 4; i++) {
    const start = moment().subtract(i, "months").startOf("month");
    const end = moment().subtract(i, "months").endOf("month");
    lastFourMonths.push({ start, end });
  }

  // ✅ Check for consistency in each of the 4 months (minimum 2000 PV)
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

  // ✅ If consistent and current order is 5000 or 10000 PV or more
  const qualifiesForAdvance = isConsistent && (currentPV >= 5000 || currentPV >= 10000);

  if (qualifiesForAdvance) {
    const bonus = Math.floor(currentPV * 0.20); // 20% bonus
    buyer.points += bonus;

    // Log the bonus to AllEntry.incoming
    buyer.AllEntry.incoming.push({
      fromUser: buyer._id,
      name: buyer.name,
      sector: "advance-consistency-bonus",
      email: buyer.email,
      pointReceived: bonus,
      product: product?.name || "Unknown Product",
      type: "advance-consistency-bonus",
      date: new Date(),
    });
  }
}

async function allocateFund(user, PV, fundType, percentage) {
  const amount = Math.floor(PV * percentage);
  if (!user.funds) user.funds = {};
  if (!user.funds[fundType]) user.funds[fundType] = 0;
  user.funds[fundType] += amount;
  if (!user.AllEntry) user.AllEntry = { incoming: [], outgoing: [] };

  user.AllEntry.incoming.push({
    fromUser: user._id,
    name: user.name,
    email: user.email,
    sector: fundType,
    pointReceived: amount,
    product: "Fund Allocation",
    type: fundType,
    date: new Date(),
  });
}

module.exports = {
  handleRepurchaseCommission,
  handleConsistencyBonus,
  handleAdvanceConsistency,
  allocateFund
};
