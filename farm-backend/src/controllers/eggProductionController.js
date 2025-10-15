const EggProduction = require('../models/EggProduction');
const BatchService = require('../services/batchService');

// @desc    Get all egg production records
// @route   GET /api/egg-production
// @access  Public
const getEggProductionRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' } = req.query;
    
    // Sort by date descending by default; convert date string YYYY-MM-DD to Date for stable sorting
    const records = await EggProduction.find()
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await EggProduction.countDocuments();

    res.status(200).json({
      success: true,
      count: records.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: records
    });
  } catch (error) {
    console.error('Error fetching egg production records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch egg production records',
      error: error.message
    });
  }
};

// @desc    Create new egg production record
// @route   POST /api/egg-production
// @access  Public
const createEggProductionRecord = async (req, res) => {
  try {
    const { date, batchNumber, birds, eggsCollected, damagedEggs, notes } = req.body;

    // Generate batch number if not provided
    let finalBatchNumber = batchNumber;
    if (!finalBatchNumber) {
      finalBatchNumber = await BatchService.generateNextBatchNumber();
    }

    // Validate required fields
    if (!date || !finalBatchNumber || !birds || eggsCollected === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: date, batchNumber, birds, eggsCollected'
      });
    }

    // Check if batch number is unique for this date
    const isUnique = await BatchService.isBatchNumberUnique(finalBatchNumber, date);
    if (!isUnique) {
      return res.status(400).json({
        success: false,
        message: 'A record with this batch number already exists for this date. Please use a different batch number or edit the existing record.',
        error: 'DUPLICATE_BATCH_NUMBER'
      });
    }

    // Validate realistic values
    const validationErrors = [];
    
    // Check birds count
    if (birds <= 0 || birds > 100000) {
      validationErrors.push('Number of birds should be between 1 and 100,000');
    }
    
    // Check eggs collected
    if (eggsCollected < 0 || eggsCollected > birds * 1.2) {
      validationErrors.push(`Eggs collected should be between 0 and ${Math.floor(birds * 1.2)} (maximum 120% of birds)`);
    }
    
    // Check production rate
    const productionRate = birds > 0 ? (eggsCollected / birds) * 100 : 0;
    if (productionRate > 120) {
      validationErrors.push(`Production rate of ${productionRate.toFixed(1)}% is unrealistic. Maximum should be 120%`);
    }
    
    // Check damaged eggs
    if (damagedEggs !== undefined && (damagedEggs < 0 || damagedEggs > eggsCollected)) {
      validationErrors.push('Damaged eggs cannot be negative or exceed total eggs collected');
    }
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors found',
        errors: validationErrors,
        guidance: {
          realisticProductionRate: '70-95% (0.7-0.95 eggs per bird per day)',
          maxProductionRate: '120% (1.2 eggs per bird per day)',
          typicalDamageRate: '2-5% of total eggs',
          suggestedEggsCollected: birds > 0 ? `${Math.floor(birds * 0.7)} - ${Math.floor(birds * 0.95)}` : '0'
        }
      });
    }

    // Create new record
    const newRecord = new EggProduction({
      date,
      batchNumber: finalBatchNumber,
      birds,
      eggsCollected,
      damagedEggs: damagedEggs || 0,
      notes: notes || ''
    });

    // Calculate production rate manually to ensure it's correct
    if (birds > 0) {
      newRecord.eggProductionRate = parseFloat(((eggsCollected / birds) * 100).toFixed(2));
    }

    const savedRecord = await newRecord.save();

    res.status(201).json({
      success: true,
      message: 'Egg production record created successfully',
      data: savedRecord
    });
  } catch (error) {
    console.error('Error creating egg production record:', error);
    
    // Handle duplicate key error (unique constraint violation)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      if (field === 'batchNumber') {
        return res.status(400).json({
          success: false,
          message: 'A record with this batch number already exists for this date. Please use a different batch number or edit the existing record.',
          error: 'DUPLICATE_BATCH_NUMBER'
        });
      }
      return res.status(400).json({
        success: false,
        message: `A record with this ${field} already exists`,
        error: 'DUPLICATE_RECORD'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create egg production record',
      error: error.message
    });
  }
};

// @desc    Get egg production summary/statistics
// @route   GET /api/egg-production/summary
// @access  Public
const getEggProductionSummary = async (req, res) => {
  try {
    const totalRecords = await EggProduction.countDocuments();
    const totalEggs = await EggProduction.aggregate([
      { $group: { _id: null, total: { $sum: '$eggsCollected' } } }
    ]);
    const totalDamagedEggs = await EggProduction.aggregate([
      { $group: { _id: null, total: { $sum: '$damagedEggs' } } }
    ]);
    const averageProductionRate = await EggProduction.aggregate([
      { $group: { _id: null, average: { $avg: '$eggProductionRate' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRecords,
        totalEggs: totalEggs[0]?.total || 0,
        totalDamagedEggs: totalDamagedEggs[0]?.total || 0,
        averageProductionRate: averageProductionRate[0]?.average?.toFixed(2) || 0,
        effectiveEggs: (totalEggs[0]?.total || 0) - (totalDamagedEggs[0]?.total || 0)
      }
    });
  } catch (error) {
    console.error('Error fetching egg production summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch summary',
      error: error.message
    });
  }
};

// @desc    Get single egg production record by ID
// @route   GET /api/egg-production/:id
// @access  Public
const getEggProductionRecordById = async (req, res) => {
  try {
    const record = await EggProduction.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Egg production record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error fetching egg production record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch egg production record',
      error: error.message
    });
  }
};

// @desc    Update egg production record
// @route   PUT /api/egg-production/:id
// @access  Public
const updateEggProductionRecord = async (req, res) => {
  try {
    const { date, batchNumber, birds, eggsCollected, damagedEggs, notes } = req.body;

    const record = await EggProduction.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Egg production record not found'
      });
    }

    // Prevent batch number changes for existing records to maintain data integrity
    if (batchNumber !== undefined && batchNumber !== record.batchNumber) {
      return res.status(400).json({
        success: false,
        message: 'Batch number cannot be changed after record creation to maintain data consistency',
        error: 'BATCH_NUMBER_IMMUTABLE'
      });
    }

    // Validate realistic values for updates
    const validationErrors = [];
    const finalBirds = birds !== undefined ? birds : record.birds;
    const finalEggsCollected = eggsCollected !== undefined ? eggsCollected : record.eggsCollected;

    // Check birds count
    if (birds !== undefined && (birds <= 0 || birds > 100000)) {
      validationErrors.push('Number of birds should be between 1 and 100,000');
    }

    // Check eggs collected
    if (eggsCollected !== undefined && (eggsCollected < 0 || eggsCollected > finalBirds * 1.2)) {
      validationErrors.push(`Eggs collected should be between 0 and ${Math.floor(finalBirds * 1.2)} (maximum 120% of birds)`);
    }

    // Check production rate
    const productionRate = finalBirds > 0 ? (finalEggsCollected / finalBirds) * 100 : 0;
    if (productionRate > 120) {
      validationErrors.push(`Production rate of ${productionRate.toFixed(1)}% is unrealistic. Maximum should be 120%`);
    }

    // Check damaged eggs
    if (damagedEggs !== undefined && (damagedEggs < 0 || damagedEggs > finalEggsCollected)) {
      validationErrors.push('Damaged eggs cannot be negative or exceed total eggs collected');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors found',
        errors: validationErrors,
        guidance: {
          realisticProductionRate: '70-95% (0.7-0.95 eggs per bird per day)',
          maxProductionRate: '120% (1.2 eggs per bird per day)',
          typicalDamageRate: '2-5% of total eggs',
          suggestedEggsCollected: finalBirds > 0 ? `${Math.floor(finalBirds * 0.7)} - ${Math.floor(finalBirds * 0.95)}` : '0'
        }
      });
    }

    // Update fields (excluding batchNumber which is immutable)
    if (date !== undefined) record.date = date;
    if (birds !== undefined) record.birds = birds;
    if (eggsCollected !== undefined) record.eggsCollected = eggsCollected;
    if (damagedEggs !== undefined) record.damagedEggs = damagedEggs;
    if (notes !== undefined) record.notes = notes;

    // Recalculate production rate after updates
    if (record.birds > 0) {
      record.eggProductionRate = parseFloat(((record.eggsCollected / record.birds) * 100).toFixed(2));
    } else {
      record.eggProductionRate = 0;
    }

    const updatedRecord = await record.save();

    res.status(200).json({
      success: true,
      message: 'Egg production record updated successfully',
      data: updatedRecord
    });
  } catch (error) {
    console.error('Error updating egg production record:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update egg production record',
      error: error.message
    });
  }
};

// @desc    Delete egg production record
// @route   DELETE /api/egg-production/:id
// @access  Public
const deleteEggProductionRecord = async (req, res) => {
  try {
    const record = await EggProduction.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Egg production record not found'
      });
    }

    await EggProduction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Egg production record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting egg production record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete egg production record',
      error: error.message
    });
  }
};

// @desc    Get production guidance for users
// @route   GET /api/egg-production/guidance
// @access  Public
const getProductionGuidance = async (req, res) => {
  try {
    const { birds } = req.query;
    
    const guidance = {
      realisticRanges: {
        productionRate: {
          excellent: '90-95%',
          good: '80-89%',
          average: '70-79%',
          poor: '60-69%',
          description: 'Percentage of birds that lay eggs per day'
        },
        eggsPerBird: {
          excellent: '0.90-0.95',
          good: '0.80-0.89',
          average: '0.70-0.79',
          poor: '0.60-0.69',
          description: 'Average eggs per bird per day'
        },
        damageRate: {
          excellent: '1-2%',
          good: '2-3%',
          average: '3-5%',
          poor: '5-10%',
          description: 'Percentage of eggs that are damaged'
        }
      },
      industryStandards: {
        commercialFarms: '80-90% production rate',
        backyardFarms: '70-85% production rate',
        peakProduction: '90-95% (birds in prime laying age)',
        seasonalVariation: '±10% depending on season and weather'
      },
      factors: {
        affectingProduction: [
          'Bird age (peak at 6-8 months)',
          'Breed type (some breeds lay more)',
          'Feed quality and nutrition',
          'Lighting conditions (14-16 hours optimal)',
          'Temperature and weather',
          'Health and disease status',
          'Stress levels and handling'
        ]
      }
    };

    // If birds count is provided, calculate specific suggestions
    if (birds && !isNaN(birds) && birds > 0) {
      const birdCount = parseInt(birds);
      guidance.suggestions = {
        birds: birdCount,
        realisticEggsCollected: {
          excellent: Math.floor(birdCount * 0.95),
          good: Math.floor(birdCount * 0.85),
          average: Math.floor(birdCount * 0.75),
          poor: Math.floor(birdCount * 0.65)
        },
        realisticDamagedEggs: {
          excellent: Math.floor(birdCount * 0.95 * 0.02), // 2% of excellent production
          good: Math.floor(birdCount * 0.85 * 0.03),     // 3% of good production
          average: Math.floor(birdCount * 0.75 * 0.04),  // 4% of average production
          poor: Math.floor(birdCount * 0.65 * 0.05)      // 5% of poor production
        },
        productionRates: {
          excellent: '95%',
          good: '85%',
          average: '75%',
          poor: '65%'
        }
      };
    }

    res.status(200).json({
      success: true,
      data: guidance
    });
  } catch (error) {
    console.error('Error getting production guidance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get production guidance',
      error: error.message
    });
  }
};

// @desc    Generate next batch number
// @route   GET /api/egg-production/next-batch-number
// @access  Public
const getNextBatchNumber = async (req, res) => {
  try {
    const nextBatchNumber = await BatchService.generateNextBatchNumber();
    res.status(200).json({
      success: true,
      data: {
        nextBatchNumber
      }
    });
  } catch (error) {
    console.error('Error generating next batch number:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate next batch number',
      error: error.message
    });
  }
};

// @desc    Get all batch numbers
// @route   GET /api/egg-production/batch-numbers
// @access  Public
const getAllBatchNumbers = async (req, res) => {
  try {
    const batchNumbers = await BatchService.getAllBatchNumbers();
    res.status(200).json({
      success: true,
      data: {
        batchNumbers
      }
    });
  } catch (error) {
    console.error('Error getting batch numbers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get batch numbers',
      error: error.message
    });
  }
};

// @desc    Get batch statistics
// @route   GET /api/egg-production/batch-statistics
// @access  Public
const getBatchStatistics = async (req, res) => {
  try {
    const statistics = await BatchService.getBatchStatistics();
    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error getting batch statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get batch statistics',
      error: error.message
    });
  }
};

// @desc    Find duplicate batches
// @route   GET /api/egg-production/duplicate-batches
// @access  Public
const findDuplicateBatches = async (req, res) => {
  try {
    const duplicates = await BatchService.findDuplicateBatches();
    res.status(200).json({
      success: true,
      data: duplicates
    });
  } catch (error) {
    console.error('Error finding duplicate batches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to find duplicate batches',
      error: error.message
    });
  }
};

module.exports = {
  getEggProductionRecords,
  getEggProductionRecordById,
  createEggProductionRecord,
  updateEggProductionRecord,
  deleteEggProductionRecord,
  getEggProductionSummary,
  getProductionGuidance,
  getNextBatchNumber,
  getAllBatchNumbers,
  getBatchStatistics,
  findDuplicateBatches
};
