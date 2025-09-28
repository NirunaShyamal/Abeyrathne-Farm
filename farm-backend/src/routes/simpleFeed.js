const express = require('express');
const {
  addFeed,
  getInventory,
  recordUsage,
  getUsageHistory
} = require('../controllers/simpleFeedController');

const router = express.Router();

// Inventory routes
router.post('/inventory', addFeed);           // Add feed to inventory
router.get('/inventory', getInventory);       // Get all inventory

// Usage routes  
router.post('/usage', recordUsage);           // Record feed usage
router.get('/usage', getUsageHistory);        // Get usage history

module.exports = router;
