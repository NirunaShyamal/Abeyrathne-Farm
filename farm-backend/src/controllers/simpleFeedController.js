const SimpleFeed = require('../models/SimpleFeed');
const SimpleUsage = require('../models/SimpleUsage');

// Add feed to inventory
const addFeed = async (req, res) => {
  try {
    const { feedType, quantity, supplier, costPerKg, addedBy } = req.body;

    // Check if this feed type already exists
    let feed = await SimpleFeed.findOne({ feedType });
    
    if (feed) {
      // If exists, add to existing quantity
      feed.quantity += parseFloat(quantity);
      feed.supplier = supplier;
      feed.costPerKg = costPerKg || 0;
      feed.addedBy = addedBy;
      feed.addedDate = new Date().toISOString().split('T')[0];
    } else {
      // Create new feed entry
      feed = new SimpleFeed({
        feedType,
        quantity: parseFloat(quantity),
        supplier,
        costPerKg: costPerKg || 0,
        addedBy
      });
    }

    await feed.save();

    res.status(201).json({
      success: true,
      message: `${quantity} KG of ${feedType} added successfully`,
      data: feed
    });

  } catch (error) {
    console.error('Error adding feed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add feed',
      error: error.message
    });
  }
};

// Get all feed inventory
const getInventory = async (req, res) => {
  try {
    const feeds = await SimpleFeed.find({}).sort({ feedType: 1 });
    
    res.status(200).json({
      success: true,
      data: feeds
    });

  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
      error: error.message
    });
  }
};

// Record feed usage
const recordUsage = async (req, res) => {
  try {
    const { feedType, quantityUsed, totalBirds, recordedBy } = req.body;

    // Find the feed in inventory
    const feed = await SimpleFeed.findOne({ feedType });
    
    if (!feed) {
      return res.status(400).json({
        success: false,
        message: `No ${feedType} found in inventory. Please add stock first.`
      });
    }

    if (feed.quantity < quantityUsed) {
      return res.status(400).json({
        success: false,
        message: `Cannot use ${quantityUsed} KG. Only ${feed.quantity} KG available.`
      });
    }

    // Create usage record
    const usage = new SimpleUsage({
      feedType,
      quantityUsed,
      totalBirds,
      recordedBy
    });

    await usage.save();

    // Reduce inventory
    await feed.useFeed(quantityUsed);

    res.status(201).json({
      success: true,
      message: `${quantityUsed} KG of ${feedType} used successfully`,
      data: {
        usage,
        remainingStock: feed.quantity
      }
    });

  } catch (error) {
    console.error('Error recording usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record usage',
      error: error.message
    });
  }
};

// Get usage history
const getUsageHistory = async (req, res) => {
  try {
    const usages = await SimpleUsage.find({}).sort({ date: -1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: usages
    });

  } catch (error) {
    console.error('Error fetching usage history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch usage history',
      error: error.message
    });
  }
};

module.exports = {
  addFeed,
  getInventory,
  recordUsage,
  getUsageHistory
};
