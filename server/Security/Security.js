const User = require("../models/User");
const jwt = require("jsonwebtoken");




//verifyToken midddleware
// const verifyToken = (req, res, next) => {
//   console.log('inside verify token', req.headers.authorization);
//   if (!req.headers.authorization) {
//     return res.status(401).send({ message: "unauthorized access" });
//   }
//   const token = req.headers.authorization.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_Token, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: "unauthorized access" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// };

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_Token, (err, decoded) => {
    if (err) {
      // console.log("JWT verify error:", err.message);
      return res.status(403).json({ message: "Forbidden" });
    }
    // console.log("Decoded token:", decoded); // ✅ এখানে full decoded token দেখা যাবে
    req.decoded = decoded; 
    next();
  });
};





const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded.user?.email; // ✅ nested 'user' থেকে email নাও

    // console.log("Decoded email:", email); // ✅ এখানে email দেখা যাবে
    const user = await User.findOne({ phone: email });

    // console.log("User found:", user); // ✅ এখানে user object দেখা যাবে

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



// Customer verification
const verifyCustomer = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    // console.log("Decoded email for customer:", email); // ✅ এখানে email দেখা যাবে
    const user = await User.findOne({ phone: email });

    if (user?.role !== "user") {
      return res.status(403).json({ message: "Forbidden: Customers only" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Admin (or SuperAdmin) verification
const verifyDSP = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const user = await User.findOne({ phone: email });

    if (user?.role !== "dsp") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { verifyDSP, verifyCustomer, verifyAdmin, verifyToken };
