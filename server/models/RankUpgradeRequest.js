// models/RankUpgradeRequest.js
const mongoose = require('mongoose');

const rankUpgradeRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  phone: String,
  previousPosition: String,
  newPosition: String,
  reward: String,
  leftBV: Number,
  rightBV: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
},{
  timestamps: true // ✅ important for createdAt and updatedAt
});

module.exports = mongoose.model('RankUpgradeRequest', rankUpgradeRequestSchema);
