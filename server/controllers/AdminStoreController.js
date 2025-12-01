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
    let Executive_Officer_Undistributed = 0;
    let Special_Fund_Undistributed = 0;
    let Tour_Fund_Undistributed = 0;
    let Car_Fund_Undistributed = 0;
    let Home_Fund_Undistributed = 0;


    // Loop over all records and sum up the fund fields safely
    for (const record of allRecords) {
      Executive_Officer_sum += record.Executive_Officer || 0;
      Special_Fund_sum += record.Special_Fund || 0;
      Car_Fund_sum += record.Car_Fund || 0;
      Tour_Fund_sum += record.Tour_Fund || 0;
      Home_Fund_sum += record.Home_Fund || 0;
      Executive_Officer_Undistributed += record.Executive_Officer_Undistributed || 0;
      Special_Fund_Undistributed  += record.Special_Fund_Undistributed || 0;
      Tour_Fund_Undistributed += record.Tour_Fund_Undistributed || 0;
      Car_Fund_Undistributed += record.Car_Fund_Undistributed || 0;
      Home_Fund_Undistributed += record.Home_Fund_Undistributed || 0;
    }

    res.status(200).json({
      Executive_Officer_sum,
      Special_Fund_sum,
      Car_Fund_sum,
      Tour_Fund_sum,
      Home_Fund_sum,
      Executive_Officer_Undistributed,
      Special_Fund_Undistributed,
      Tour_Fund_Undistributed,
      Car_Fund_Undistributed,
      Home_Fund_Undistributed,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.AddAdminStoreData = async (req, res) => {
  try {
    const allRecords = await AdminStore.find();

    // map fields
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

    // 🆕 new field map for undistributed fund store
    const undistributedFieldMap = {
      "Executive Officer": "Executive_Officer_Undistributed",
      "Executive Manager": "Special_Fund_Undistributed",
      "Executive Director": "Tour_Fund_Undistributed",
      "Diamond": "Car_Fund_Undistributed",
      "Crown Director": "Home_Fund_Undistributed",
    };

    let distributedPositions = [];
    let undistributedPositions = [];

    for (const position of Object.keys(fundFieldMap)) {
      const fundField = fundFieldMap[position];

      // console.log(`Processing position: ${position}`);
      const undistributedField = undistributedFieldMap[position];
      const users = await User.find({ Position: position });

      const totalFund = allRecords.reduce((sum, rec) => sum + (rec[fundField] || 0), 0);

      // 🚫 no users = move to UndistributedStore field
      if (!users.length) {
        // console.log(`No users found for ${position} — moving fund to ${undistributedField}`);

        await AdminStore.updateMany(
          {},
          {
            $inc: { [undistributedField]: totalFund },
            $set: { [fundField]: 0 },
          }
        );

        undistributedPositions.push(position);
        continue;
      }

      // ✅ distribute fund if users exist
      const perUserFund = totalFund / users.length;

      for (const user of users) {
        const newEntry = {
          sector: sectorNameMap[position] || "General Fund",
          pointReceived: perUserFund,
          date: new Date(),
        };

        await User.updateOne(
          { _id: user._id },
          { $push: { "AllEntry.incoming": newEntry } }
        );

        // console.log(`✅ ${perUserFund} added to ${user.name} (${position})`);
      }

      distributedPositions.push(position);

      // zero out fund after distribution
      await AdminStore.updateMany(
        { [fundField]: { $gt: 0 } },
        { $set: { [fundField]: 0 } }
      );
    }

    res.json({
      message: "✅ Fund distribution completed",
      distributed: distributedPositions,
      undistributed: undistributedPositions,
    });

  } catch (error) {
    console.error("❌ Error in AddAdminStoreData:", error);
    res.status(500).json({ message: "Server error during fund distribution" });
  }
};


