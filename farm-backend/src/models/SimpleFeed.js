const mongoose = require('mongoose');

const simpleFeedSchema = new mongoose.Schema({
  feedType: {
    type: String,
    required: true,
    enum: ['Layer Feed', 'Chick Starter', 'Grower Feed', 'Medicated Feed', 'Organic Feed', 'Finisher Feed'],
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    default: 'KG'
  },
  supplier: {
    type: String,
    required: true,
    trim: true
  },
  costPerKg: {
    type: Number,
    default: 0,
    min: [0, 'Cost cannot be negative']
  },
  addedDate: {
    type: String,
    required: true,
    default: () => new Date().toISOString().split('T')[0]
  },
  addedBy: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Simple method to reduce quantity
simpleFeedSchema.methods.useFeed = function(amount) {
  if (amount > this.quantity) {
    throw new Error(`Cannot use ${amount} KG. Only ${this.quantity} KG available.`);
  }
  this.quantity -= amount;
  return this.save();
};

module.exports = mongoose.model('SimpleFeed', simpleFeedSchema, 'simplefeeds');
