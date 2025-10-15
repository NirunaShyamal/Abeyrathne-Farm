require('dotenv').config();
const mongoose = require('mongoose');
const EggProduction = require('../models/EggProduction');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://Niruna:niruna123@codez.7wxzojy.mongodb.net/farm_management?retryWrites=true&w=majority';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const fixDuplicateBatchNumbers = async () => {
  try {
    console.log('🔍 Checking for duplicate batch numbers in egg production records...');

    const records = await EggProduction.find().sort({ date: 1, createdAt: 1 });
    console.log(`📊 Found ${records.length} total records`);

    // Group records by batch number
    const batchGroups = {};
    const duplicates = [];

    records.forEach(record => {
      if (!batchGroups[record.batchNumber]) {
        batchGroups[record.batchNumber] = [];
      }
      batchGroups[record.batchNumber].push(record);

      if (batchGroups[record.batchNumber].length > 1) {
        duplicates.push(record.batchNumber);
      }
    });

    const uniqueDuplicates = [...new Set(duplicates)];
    console.log(`\n🚨 Found ${uniqueDuplicates.length} batch numbers with duplicates:`);

    uniqueDuplicates.forEach(batchNumber => {
      const duplicateRecords = batchGroups[batchNumber];
      console.log(`\n📋 Batch ${batchNumber} (${duplicateRecords.length} records):`);
      duplicateRecords.forEach((record, index) => {
        console.log(`  ${index + 1}. Date: ${record.date}, ID: ${record._id}, Birds: ${record.birds}, Eggs: ${record.eggsCollected}`);
      });
    });

    if (uniqueDuplicates.length === 0) {
      console.log('\n✅ No duplicate batch numbers found! All batch numbers are unique.');
      return;
    }

    // Fix duplicates by generating new unique batch numbers
    console.log('\n🔧 Fixing duplicate batch numbers...');

    let fixedCount = 0;

    for (const batchNumber of uniqueDuplicates) {
      const duplicateRecords = batchGroups[batchNumber];

      // Keep the first record with the original batch number
      console.log(`\n📝 Keeping original batch number for record: ${duplicateRecords[0].date} (${duplicateRecords[0]._id})`);

      // Generate new batch numbers for the rest
      for (let i = 1; i < duplicateRecords.length; i++) {
        const record = duplicateRecords[i];

        // Generate a new unique batch number
        const existingBatches = records.map(r => r.batchNumber);
        let newBatchNumber;
        let counter = 1;

        do {
          newBatchNumber = `Batch-${String(counter).padStart(3, '0')}`;
          counter++;
        } while (existingBatches.includes(newBatchNumber));

        console.log(`🔄 Changing batch number for record ${record.date} (${record._id}): ${record.batchNumber} → ${newBatchNumber}`);

        record.batchNumber = newBatchNumber;
        await record.save();

        existingBatches.push(newBatchNumber);
        fixedCount++;
      }
    }

    console.log(`\n✅ Successfully fixed ${fixedCount} duplicate batch numbers`);

    // Verify the fix
    console.log('\n🔍 Verifying fix...');
    const updatedRecords = await EggProduction.find().sort({ date: 1 });
    const updatedBatchGroups = {};

    updatedRecords.forEach(record => {
      if (!updatedBatchGroups[record.batchNumber]) {
        updatedBatchGroups[record.batchNumber] = [];
      }
      updatedBatchGroups[record.batchNumber].push(record);
    });

    const remainingDuplicates = Object.values(updatedBatchGroups).filter(group => group.length > 1);

    if (remainingDuplicates.length === 0) {
      console.log('✅ All duplicate batch numbers have been successfully fixed!');
    } else {
      console.log(`⚠️  Still found ${remainingDuplicates.length} duplicate batch numbers. Manual review may be required.`);
    }

    // Show final summary
    console.log('\n📊 Final Batch Number Summary:');
    console.log('==============================');
    Object.entries(updatedBatchGroups).forEach(([batchNumber, records]) => {
      console.log(`${batchNumber}: ${records.length} record(s)`);
    });

  } catch (error) {
    console.error('❌ Error fixing duplicate batch numbers:', error);
  }
};

const main = async () => {
  try {
    await connectDB();
    await fixDuplicateBatchNumbers();
    console.log('\n🎉 Duplicate batch number fix completed!');
  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
};

main();
