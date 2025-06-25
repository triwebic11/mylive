// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     phone: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     name: { type: String },
//     email: { type: String },
//     dob: { type: Date },

//     // 🔗 Referral related fields
//     referralCode: { type: String, unique: true },
//     referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     referId: { type: String }, // Short name+number ID
//     userId: { type: String },  // Unique user code like USR1234

//     referData: [
//       {
//         generation: { type: Number },
//         referredUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       },
//     ],

//     // 🧾 Account & package info
//     package: { type: String, default: "Friend" },
//     packagePV: { type: Number, default: 1000 },
//     packageAmount: { type: Number, default: 2000 },
//     accountStatus: { type: String, default: "active" },
//     totalPV: { type: Number, default: 0 },
//     totalAmount: { type: Number, default: 0 },
//     allEntries: { type: Array, default: [] },

//     // 🏠 Extra user info
//     referrerId: { type: String },
//     placementId: { type: String },
//     division: { type: String },
//     city: { type: String },
//     postcode: { type: String },
//     address: { type: String },

//     // 🧑‍💼 Role
//     role: { type: String, enum: ["user", "admin"], default: "user" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    division: {
      type: String,
      enum: [
        "Dhaka",
        "Chattagram",
        "Khulna",
        "Rajshahi",
        "Sylhet",
        "Barishal",
        "Rangpur",
        "Mymensingh",
      ],
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    referralCode: {
      type: String,
      unique: true,
    },

    referredBy: {
      type: String,
      default: null,
    },

    referralTree: {
      type: [String], // up to 10 levels
      default: [],
    },
    points: {
      type: Number,
      default: 0,
    },

    address: String,
    bankInfo: {
      bkash: String,
      nagad: String,
      rocket: String,
      bankName: String,
      accountNumber: String,
      accountHolder: String,
      branch: String,
      routeNo: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    strict: false, // Allows for flexible schema
  }
);

module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {},
//   {
//     timestamps: true,
//     strict: false,
//   }
// );

// module.exports = mongoose.model("User", userSchema);
