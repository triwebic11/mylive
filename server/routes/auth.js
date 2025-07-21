// routes/auth.js

const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { phone } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 min

  user.resetToken = resetToken;
  user.resetTokenExpires = resetTokenExpires;
  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shslira@gmail.com", // তোমার Gmail
      pass: "sfcatytkrfzgcesa", // App Password
    },
  });

  await transporter.sendMail({
    from: '"My App" <shslira@gmail.com>',
    to: user.email, // Email তোমার DB তে থাকতে হবে
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
  });

  res.json({ message: "Reset link sent to your email." });
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Token invalid or expired" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await user.save();

  res.json({ message: "Password reset successfully!" });
});

module.exports = router;
