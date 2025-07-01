const generationLimitByPackage = (pkg) => {
  switch (pkg) {
    case "Normal":
      return 5;
    case "Silver":
      return 10;
    case "Gold":
      return 15;
    case "Platinum":
      return 999; // unlimited
    default:
      return 0;
  }
};

module.exports = generationLimitByPackage;
