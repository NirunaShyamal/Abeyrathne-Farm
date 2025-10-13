const mongoose = require('mongoose');

const farmMetricsSchema = new mongoose.Schema({
  totalBirds: {
    type: Number,
    required: [true, 'Total birds count is required'],
    min: [0, 'Total birds cannot be negative'],
    default: 100000
  },
  mortalityRate: {
    type: Number,
    required: [true, 'Mortality rate is required'],
    min: [0, 'Mortality rate cannot be negative'],
    max: [100, 'Mortality rate cannot exceed 100%'],
    default: 2.5
  },
  totalEggs: {
    type: Number,
    required: [true, 'Total eggs count is required'],
    min: [0, 'Total eggs cannot be negative'],
    default: 0
  },
  totalEmployees: {
    type: Number,
    required: [true, 'Total employees count is required'],
    min: [0, 'Total employees cannot be negative'],
    default: 25
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Ensure only one document exists
farmMetricsSchema.index({}, { unique: true });

module.exports = mongoose.model('FarmMetrics', farmMetricsSchema);



