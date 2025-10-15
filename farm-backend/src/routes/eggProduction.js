const express = require('express');
const {
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
} = require('../controllers/eggProductionController');

const router = express.Router();

// @route   GET /api/egg-production
// @desc    Get all egg production records
// @access  Public
router.get('/', getEggProductionRecords);

// @route   POST /api/egg-production
// @desc    Create new egg production record
// @access  Public
router.post('/', createEggProductionRecord);

// @route   GET /api/egg-production/summary
// @desc    Get egg production summary/statistics
// @access  Public
router.get('/summary', getEggProductionSummary);

// @route   GET /api/egg-production/guidance
// @desc    Get production guidance for users
// @access  Public
router.get('/guidance', getProductionGuidance);

// @route   GET /api/egg-production/:id
// @desc    Get single egg production record by ID
// @access  Public
router.get('/:id', getEggProductionRecordById);

// @route   PUT /api/egg-production/:id
// @desc    Update egg production record
// @access  Public
router.put('/:id', updateEggProductionRecord);

// @route   DELETE /api/egg-production/:id
// @desc    Delete egg production record
// @access  Public
router.delete('/:id', deleteEggProductionRecord);

// @route   GET /api/egg-production/next-batch-number
// @desc    Generate next batch number
// @access  Public
router.get('/batch/next-batch-number', getNextBatchNumber);

// @route   GET /api/egg-production/batch-numbers
// @desc    Get all batch numbers
// @access  Public
router.get('/batch/batch-numbers', getAllBatchNumbers);

// @route   GET /api/egg-production/batch-statistics
// @desc    Get batch statistics
// @access  Public
router.get('/batch/batch-statistics', getBatchStatistics);

// @route   GET /api/egg-production/duplicate-batches
// @desc    Find duplicate batches
// @access  Public
router.get('/batch/duplicate-batches', findDuplicateBatches);

module.exports = router;
