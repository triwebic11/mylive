const AdminStore = require("../models/AdminStore"); // adjust the path to your model
const User = require("../models/User");
const positionLevels = [
  { position: "Executive Officer", fundKey: "Executive_Officer_sum" },
  { position: "Executive Manager", fundKey: "Special_Fund_sum" },
  { position: "Executive Director", fundKey: "Tour_Fund_sum" },
  { position: "Diamond", fundKey: "Car_Fund_sum" },
  { position: "Crown Director", fundKey: "Home_Fund_sum" },
];

// GET: Fetch all AdminStore records
exports.getStore = async (req, res) => {
  try {
    const Adminroute = await AdminStore.find();

    res.status(200).json(Adminroute);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getStoresummery = async (req, res) => {
  try {
    const allRecords = await AdminStore.find();

    // Initialize sum variables
    let Executive_Officer_sum = 0;
    let Special_Fund_sum = 0;
    let Car_Fund_sum = 0;
    let Tour_Fund_sum = 0;
    let Home_Fund_sum = 0;

    // Loop over all records and sum up the fund fields safely
    for (const record of allRecords) {
      Executive_Officer_sum += record.Executive_Officer || 0;
      Special_Fund_sum += record.Special_Fund || 0;
      Car_Fund_sum += record.Car_Fund || 0;
      Tour_Fund_sum += record.Tour_Fund || 0;
      Home_Fund_sum += record.Home_Fund || 0;
    }

    res.status(200).json({
      Executive_Officer_sum,
      Special_Fund_sum,
      Car_Fund_sum,
      Tour_Fund_sum,
      Home_Fund_sum,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const sectorNameMap = {
  "Executive Officer": "Executive Officer Fund",
  "Executive Manager": "Special Fund",
  "Executive Director": "Tour Fund",
  "Diamond": "Car Fund",
  "Crown Director": "Home Fund",
};


exports.AddAdminStoreData = async (req, res) => {
  try {
    const allRecords = await AdminStore.find();

    // Map for easier looping
    const fundFieldMap = {
      "Executive Officer": "Executive_Officer",
      "Executive Manager": "Special_Fund",
      "Executive Director": "Tour_Fund",
      "Diamond": "Car_Fund",
      "Crown Director": "Home_Fund",
    };

    const sectorNameMap = {
      "Executive Officer": "Executive Officer Commission",
      "Executive Manager": "Special Fund Commission",
      "Executive Director": "Travel Fund Commission",
      "Diamond": "Car Fund Commission",
      "Crown Director": "House Fund Commission",
    };

    let distributedPositions = [];

    // 1️⃣ Distribute funds to users
    for (const { position } of positionLevels) {
      const fundField = fundFieldMap[position];
      const users = await User.find({ Position: position });

      if (!users.length) {
        console.log(`No users found for position ${position} — skipping`);
        continue;
      }

      // Calculate total fund for this position
      const totalFund = allRecords.reduce((sum, rec) => sum + (rec[fundField] || 0), 0);
      const perUserFund = totalFund / users.length;

      for (const user of users) {
        const newEntry = {
        //   fromUser: "SYSTEM",
          sector: sectorNameMap[position] || "General Fund",
          pointReceived: perUserFund,
          date: new Date(),
        };

        await User.updateOne(
          { _id: user._id },
          { $push: { "AllEntry.incoming": newEntry } }
        );

        console.log(`Added ${perUserFund} to ${user.name} (${position})`);
      }

      distributedPositions.push(position); // mark position for zeroing
    }

    // 2️⃣ Zero out only the funds for distributed positions
    for (const position of distributedPositions) {
      const fundField = fundFieldMap[position];
      await AdminStore.updateMany(
        { [fundField]: { $gt: 0 } },
        { $set: { [fundField]: 0 } }
      );
      console.log(`Zeroed out ${fundField} in AdminStore after distribution`);
    }

    res.json({
      message: `Funds distribution completed for positions: ${distributedPositions.join(", ")}`,
    });

  } catch (error) {
    console.error("Error in AddAdminStoreData:", error);
    res.status(500).json({ message: "Server error during fund distribution" });
  }
};

