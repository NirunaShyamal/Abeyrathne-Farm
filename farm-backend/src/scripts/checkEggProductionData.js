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

const checkEggProductionData = async () => {
  try {
    console.log('🔍 Checking egg production data...');
    
    const records = await EggProduction.find();
    console.log(`📊 Found ${records.length} records`);
    console.log('\n📋 Current Egg Production Records:');
    console.log('=====================================');
    
    records.forEach((record, index) => {
      console.log(`\nRecord ${index + 1}:`);
      console.log(`  Date: ${record.date}`);
      console.log(`  Batch: ${record.batchNumber}`);
      console.log(`  Birds: ${record.birds}`);
      console.log(`  Eggs Collected: ${record.eggsCollected}`);
      console.log(`  Damaged Eggs: ${record.damagedEggs || 0}`);
      console.log(`  Production Rate: ${record.eggProductionRate}%`);
      
      // Calculate what the rate should be
      const expectedRate = record.birds > 0 ? ((record.eggsCollected / record.birds) * 100).toFixed(2) : 0;
      console.log(`  Expected Rate: ${expectedRate}%`);
      
      // Check if data seems realistic
      const eggsPerBird = record.birds > 0 ? (record.eggsCollected / record.birds).toFixed(2) : 0;
      console.log(`  Eggs per Bird: ${eggsPerBird}`);
      
      if (eggsPerBird > 2) {
        console.log(`  ⚠️  WARNING: Unrealistic data - more than 2 eggs per bird per day`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  }
};

const main = async () => {
  try {
    await connectDB();
    await checkEggProductionData();
  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Database connection closed');
    process.exit(0);
  }
};

main();

