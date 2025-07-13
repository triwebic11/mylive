const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // e.g., Bearer xyz...

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ এইখানেই মূল magic — decoded._id থাকবে
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden. Invalid token." });
  }
};

module.exports = verifyJWT;
