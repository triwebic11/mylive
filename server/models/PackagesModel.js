const mongoose = require('mongoose');

const PackagesModel = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  PV: {
    type: Number,
    required: true
  },
  GenerationLevel: {
    type: Number,
    required: true
  },
  MegaGenerationLevel: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    required: true
  }
}, {
  timestamps: true,
  collection: 'Packages' // ✅ Force Mongoose to use exact collection name
});

module.exports = mongoose.model('Packages', PackagesModel);
