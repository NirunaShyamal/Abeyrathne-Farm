const FarmMetrics = require('../models/FarmMetrics');

// Get current farm metrics
const getFarmMetrics = async (req, res) => {
  try {
    let farmMetrics = await FarmMetrics.findOne();
    
    // If no metrics exist, create default ones
    if (!farmMetrics) {
      farmMetrics = new FarmMetrics({
        totalBirds: 100000,
        mortalityRate: 2.5,
        totalEggs: 0,
        totalEmployees: 25,
        updatedBy: req.user.id
      });
      await farmMetrics.save();
    }

    res.json({
      success: true,
      data: farmMetrics
    });
  } catch (error) {
    console.error('Error fetching farm metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching farm metrics',
      error: error.message
    });
  }
};

// Update farm metrics
const updateFarmMetrics = async (req, res) => {
  try {
    const { totalBirds, totalEmployees } = req.body;
    
    // Calculate mortality rate based on bird count
    const calculateMortalityRate = (birdCount) => {
      const baseMortalityRate = 2.5; // 2.5% base rate
      
      if (birdCount > 50000) {
        return baseMortalityRate + 0.5; // Slightly higher for large flocks
      } else if (birdCount < 10000) {
        return baseMortalityRate - 0.5; // Lower for smaller flocks
      }
      return baseMortalityRate;
    };

    // Get current total eggs from egg production data
    const EggProduction = require('../models/EggProduction');
    const eggData = await EggProduction.find();
    const totalEggs = eggData.reduce((sum, record) => sum + (record.eggsCollected || 0), 0);

    const mortalityRate = calculateMortalityRate(totalBirds);

    // Update or create farm metrics
    let farmMetrics = await FarmMetrics.findOne();
    
    if (farmMetrics) {
      farmMetrics.totalBirds = totalBirds;
      farmMetrics.mortalityRate = mortalityRate;
      farmMetrics.totalEggs = totalEggs;
      farmMetrics.totalEmployees = totalEmployees;
      farmMetrics.lastUpdated = new Date();
      farmMetrics.updatedBy = req.user.id;
      
      await farmMetrics.save();
    } else {
      farmMetrics = new FarmMetrics({
        totalBirds,
        mortalityRate,
        totalEggs,
        totalEmployees,
        updatedBy: req.user.id
      });
      await farmMetrics.save();
    }

    res.json({
      success: true,
      message: 'Farm metrics updated successfully',
      data: farmMetrics
    });
  } catch (error) {
    console.error('Error updating farm metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating farm metrics',
      error: error.message
    });
  }
};

// Update total eggs from production data
const updateTotalEggs = async (req, res) => {
  try {
    const EggProduction = require('../models/EggProduction');
    const eggData = await EggProduction.find();
    const totalEggs = eggData.reduce((sum, record) => sum + (record.eggsCollected || 0), 0);

    let farmMetrics = await FarmMetrics.findOne();
    
    if (farmMetrics) {
      farmMetrics.totalEggs = totalEggs;
      farmMetrics.lastUpdated = new Date();
      await farmMetrics.save();
    } else {
      farmMetrics = new FarmMetrics({
        totalBirds: 100000,
        mortalityRate: 2.5,
        totalEggs,
        totalEmployees: 25,
        updatedBy: req.user.id
      });
      await farmMetrics.save();
    }

    res.json({
      success: true,
      message: 'Total eggs updated successfully',
      data: { totalEggs }
    });
  } catch (error) {
    console.error('Error updating total eggs:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating total eggs',
      error: error.message
    });
  }
};

module.exports = {
  getFarmMetrics,
  updateFarmMetrics,
  updateTotalEggs
};



