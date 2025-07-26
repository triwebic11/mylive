const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "No user found with this email." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const CLIENT_BASE_URL = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${CLIENT_BASE_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_RESET_USER, // .env file থেকে নাও
        pass: process.env.EMAIL_RESET_PASS,
      },
    });

    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_RESET_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested to reset your password.</p>
             <p>Click <a href="${resetLink}">here</a> to reset it.</p>
             <p>This link will expire in 15 minutes.</p>`,
    });

    res.json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while sending reset link." });
  }
});

// Reset Password
// Already inside router.post("/reset-password/:token", ...)
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters." });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ message: "Server error during password reset." });
  }
});

module.exports = router;
