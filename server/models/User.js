const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    dob: { type: Date },

    // 🔗 Referral related fields
    referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    referId: { type: String }, // Short name+number ID
    userId: { type: String },  // Unique user code like USR1234

    referData: [
      {
        generation: { type: Number },
        referredUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    // 🧾 Account & package info
    package: { type: String, default: "Friend" },
    packagePV: { type: Number, default: 1000 },
    packageAmount: { type: Number, default: 2000 },
    accountStatus: { type: String, default: "active" },
    totalPV: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    allEntries: { type: Array, default: [] },

    // 🏠 Extra user info
    referrerId: { type: String },
    placementId: { type: String },
    division: { type: String },
    city: { type: String },
    postcode: { type: String },
    address: { type: String },

    // 🧑‍💼 Role
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);



// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({}, { 
//   timestamps: true, 
//   strict: false 
// });

// module.exports = mongoose.model("User", userSchema);

