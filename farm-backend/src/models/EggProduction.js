const mongoose = require('mongoose');

const eggProductionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, 'Date is required'],
    trim: true
  },
  batchNumber: {
    type: String,
    required: [true, 'Batch number is required'],
    trim: true
  },
  birds: {
    type: Number,
    required: [true, 'Number of birds is required'],
    min: [1, 'Must have at least 1 bird']
  },
  eggsCollected: {
    type: Number,
    required: [true, 'Eggs collected is required'],
    min: [0, 'Eggs collected cannot be negative']
  },
  damagedEggs: {
    type: Number,
    default: 0,
    min: [0, 'Damaged eggs cannot be negative']
  },
  eggProductionRate: {
    type: Number,
    default: function() {
      // Production rate should be calculated as percentage of birds that laid eggs
      // Assuming each bird can lay 1 egg per day, the rate is (eggsCollected / birds) * 100
      return this.birds > 0 ? parseFloat(((this.eggsCollected / this.birds) * 100).toFixed(2)) : 0;
    }
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Calculate production rate before saving
eggProductionSchema.pre('save', function(next) {
  if (this.birds > 0) {
    // Production rate: percentage of birds that laid eggs (assuming 1 egg per bird per day)
    this.eggProductionRate = parseFloat(((this.eggsCollected / this.birds) * 100).toFixed(2));
  } else {
    this.eggProductionRate = 0;
  }
  next();
});

// Add compound index to ensure unique batch numbers per date
eggProductionSchema.index({ batchNumber: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('EggProduction', eggProductionSchema);
