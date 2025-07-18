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

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     dob: {
//       type: Date,
//     },
//     division: {
//       type: String,
//       enum: [
//         "Dhaka",
//         "Chattagram",
//         "Khulna",
//         "Rajshahi",
//         "Sylhet",
//         "Barishal",
//         "Rangpur",
//         "Mymensingh",
//       ],
//     },
//     city: {
//       type: String,
//     },
//     postcode: {
//       type: String,
//     },
//     address: {
//       type: String,
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     referralCode: {
//       type: String,
//       unique: true,
//     },

//     referredBy: {
//       type: String,
//       default: null,
//     },

//     referralTree: {
//       type: [String], // up to 10 levels
//       default: [],
//     },
//     points: {
//       type: Number,
//       default: 0,
//     },
//     package: {
//       type: String,
//       enum: ["Normal", "Silver", "Gold", "Platinum"],
//       default: "Normal",
//     },
//     packageExpireDate: {
//       type: Date,
//     },

//     address: String,
//     bankInfo: {
//       bkash: String,
//       nagad: String,
//       rocket: String,
//       bankName: String,
//       accountNumber: String,
//       accountHolder: String,
//       branch: String,
//       routeNo: String,
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//   },
//   {
//     timestamps: true,
//     strict: false, // Allows for flexible schema
//   }
// );

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    password: String,
    referralCode: String,
    referredBy: String,
    referredByUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ইউজার আইডি রেফারার
    userStatus: String,
    GenerationLevel: {
      type: Number,
      default: 0,
    },
    MegaGenerationLevel: {
      type: Number,
      default: 0,
    },
    TargetPV: [Number],
    Position: String,

    referralTree: [String],
    points: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "user",
    },
    package: {
      type: String,
      default: "Normal",
    },
    //   frontImage: {
    //   type: String,
    //   required: true,
    // },
    // backImage: {
    //   type: String,
    //   required: true,
    // },
    PackagePV: String,
    AllEntry: {
      incoming: [
        {
          fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          name: String,
          sector: String,
          email: String,
          pointReceived: Number,
          product: String,
          type: String,          // Added type for filtering (e.g. "self-purchase")
          date: Date,
        },
      ],
      outgoing: [
        {
          toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          name: String,
          sector: String,
          email: String,
          pointGiven: Number,
          product: String,
          date: Date,
        },
      ],
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);


module.exports = mongoose.model("User", userSchema);

