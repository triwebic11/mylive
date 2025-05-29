const User = require("../models/User");

// Register
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Users (example route)
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
