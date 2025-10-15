const EggProduction = require('../models/EggProduction');

/**
 * Batch Management Service
 * Handles generation and validation of batch numbers for egg production
 */
class BatchService {

  /**
   * Generate the next available batch number
   * @returns {Promise<string>} The next batch number in format "Batch-XXX"
   */
  static async generateNextBatchNumber() {
    try {
      // Get all existing batch numbers
      const records = await EggProduction.find({}, 'batchNumber');
      const existingBatches = records.map(record => record.batchNumber);

      // Extract numeric parts and find the highest
      const batchNumbers = existingBatches
        .filter(batch => batch && batch.startsWith('Batch-'))
        .map(batch => {
          const num = batch.split('-')[1];
          return parseInt(num, 10) || 0;
        });

      const maxBatch = Math.max(...batchNumbers, 0);
      const nextBatch = maxBatch + 1;

      return `Batch-${nextBatch.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating next batch number:', error);
      // Fallback to a default batch number
      return 'Batch-001';
    }
  }

  /**
   * Validate if a batch number is unique for a given date
   * @param {string} batchNumber - The batch number to validate
   * @param {string} date - The date in YYYY-MM-DD format
   * @param {string} excludeId - Optional record ID to exclude from the check (for updates)
   * @returns {Promise<boolean>} True if unique, false if already exists
   */
  static async isBatchNumberUnique(batchNumber, date, excludeId = null) {
    try {
      const query = {
        batchNumber: batchNumber,
        date: date
      };

      if (excludeId) {
        query._id = { $ne: excludeId };
      }

      const existingRecord = await EggProduction.findOne(query);
      return !existingRecord;
    } catch (error) {
      console.error('Error validating batch number uniqueness:', error);
      return false;
    }
  }

  /**
   * Get all unique batch numbers in the system
   * @returns {Promise<string[]>} Array of unique batch numbers
   */
  static async getAllBatchNumbers() {
    try {
      const records = await EggProduction.find({}, 'batchNumber');
      const uniqueBatches = [...new Set(records.map(record => record.batchNumber))];
      return uniqueBatches.filter(batch => batch); // Remove any null/undefined values
    } catch (error) {
      console.error('Error getting all batch numbers:', error);
      return [];
    }
  }

  /**
   * Get batch statistics
   * @returns {Promise<Object>} Statistics about batch numbers
   */
  static async getBatchStatistics() {
    try {
      const records = await EggProduction.find({}, 'batchNumber date eggsCollected birds');

      const batchStats = {};
      let totalEggs = 0;
      let totalBirds = 0;
      const uniqueBatches = new Set();

      records.forEach(record => {
        if (record.batchNumber) {
          uniqueBatches.add(record.batchNumber);

          if (!batchStats[record.batchNumber]) {
            batchStats[record.batchNumber] = {
              count: 0,
              totalEggs: 0,
              totalBirds: 0,
              dates: []
            };
          }

          batchStats[record.batchNumber].count++;
          batchStats[record.batchNumber].totalEggs += record.eggsCollected || 0;
          batchStats[record.batchNumber].totalBirds += record.birds || 0;
          batchStats[record.batchNumber].dates.push(record.date);

          totalEggs += record.eggsCollected || 0;
          totalBirds += record.birds || 0;
        }
      });

      return {
        totalBatches: uniqueBatches.size,
        totalRecords: records.length,
        totalEggs,
        totalBirds,
        averageEggsPerBatch: uniqueBatches.size > 0 ? (totalEggs / uniqueBatches.size).toFixed(1) : 0,
        batchDetails: batchStats
      };
    } catch (error) {
      console.error('Error getting batch statistics:', error);
      return {
        totalBatches: 0,
        totalRecords: 0,
        totalEggs: 0,
        totalBirds: 0,
        averageEggsPerBatch: 0,
        batchDetails: {}
      };
    }
  }

  /**
   * Find records with duplicate batch numbers
   * @returns {Promise<Object>} Object containing duplicate batch information
   */
  static async findDuplicateBatches() {
    try {
      const records = await EggProduction.find({}, 'batchNumber date _id');

      const batchGroups = {};
      const duplicates = [];

      records.forEach(record => {
        if (!batchGroups[record.batchNumber]) {
          batchGroups[record.batchNumber] = [];
        }
        batchGroups[record.batchNumber].push({
          id: record._id,
          date: record.date
        });

        if (batchGroups[record.batchNumber].length > 1) {
          if (!duplicates.some(d => d.batchNumber === record.batchNumber)) {
            duplicates.push({
              batchNumber: record.batchNumber,
              records: batchGroups[record.batchNumber]
            });
          }
        }
      });

      return {
        hasDuplicates: duplicates.length > 0,
        duplicateCount: duplicates.length,
        duplicates: duplicates
      };
    } catch (error) {
      console.error('Error finding duplicate batches:', error);
      return {
        hasDuplicates: false,
        duplicateCount: 0,
        duplicates: []
      };
    }
  }
}

module.exports = BatchService;
