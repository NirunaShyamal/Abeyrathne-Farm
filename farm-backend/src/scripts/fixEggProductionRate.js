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

const fixEggProductionRates = async () => {
  try {
    console.log('🔧 Fixing egg production rates...');
    
    // Get all egg production records
    const records = await EggProduction.find();
    console.log(`📊 Found ${records.length} records to update`);
    
    let updatedCount = 0;
    
    for (const record of records) {
      if (record.birds > 0) {
        const correctRate = parseFloat(((record.eggsCollected / record.birds) * 100).toFixed(2));
        
        if (record.eggProductionRate !== correctRate) {
          console.log(`🔄 Updating record ${record._id}: ${record.eggProductionRate}% → ${correctRate}%`);
          record.eggProductionRate = correctRate;
          await record.save();
          updatedCount++;
        }
      } else {
        if (record.eggProductionRate !== 0) {
          console.log(`🔄 Updating record ${record._id}: ${record.eggProductionRate}% → 0% (no birds)`);
          record.eggProductionRate = 0;
          await record.save();
          updatedCount++;
        }
      }
    }
    
    console.log(`✅ Fixed ${updatedCount} records`);
    
    // Show summary of corrected records
    const correctedRecords = await EggProduction.find().sort({ date: -1 });
    console.log('\n📋 Updated Records Summary:');
    console.log('=====================================');
    
    correctedRecords.forEach(record => {
      console.log(`📅 ${record.date} | Batch: ${record.batchNumber} | Birds: ${record.birds} | Eggs: ${record.eggsCollected} | Rate: ${record.eggProductionRate}%`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing production rates:', error);
  }
};

const main = async () => {
  try {
    await connectDB();
    await fixEggProductionRates();
    console.log('\n🎉 Egg production rate fix completed!');
  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
};

main();

