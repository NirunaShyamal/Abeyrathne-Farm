const mongoose = require('mongoose');

const simpleUsageSchema = new mongoose.Schema({
  feedType: {
    type: String,
    required: true,
    enum: ['Layer Feed', 'Chick Starter', 'Grower Feed', 'Medicated Feed', 'Organic Feed', 'Finisher Feed'],
    trim: true
  },
  quantityUsed: {
    type: Number,
    required: true,
    min: [0, 'Quantity used cannot be negative']
  },
  totalBirds: {
    type: Number,
    required: true,
    min: [1, 'Must have at least 1 bird']
  },
  date: {
    type: String,
    required: true,
    default: () => new Date().toISOString().split('T')[0]
  },
  recordedBy: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SimpleUsage', simpleUsageSchema, 'simpleusage');
