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

const checkEggProductionRates = async () => {
  try {
    console.log('🔍 Checking egg production rates...');
    
    const records = await EggProduction.find().sort({ date: -1 });
    console.log(`📊 Found ${records.length} egg production records`);
    console.log('\n📋 Detailed Production Rate Analysis:');
    console.log('=====================================');
    
    let totalProductionRate = 0;
    let validRecords = 0;
    
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
      
      // Check if rates match
      const ratesMatch = Math.abs(record.eggProductionRate - parseFloat(expectedRate)) < 0.01;
      console.log(`  Rates Match: ${ratesMatch ? '✅' : '❌'}`);
      
      // Calculate eggs per bird
      const eggsPerBird = record.birds > 0 ? (record.eggsCollected / record.birds).toFixed(2) : 0;
      console.log(`  Eggs per Bird: ${eggsPerBird}`);
      
      // Check if data is realistic
      const isRealistic = parseFloat(eggsPerBird) <= 2.0; // Should be ≤ 2 eggs per bird per day
      console.log(`  Realistic Data: ${isRealistic ? '✅' : '❌'}`);
      
      if (record.eggProductionRate > 0) {
        totalProductionRate += record.eggProductionRate;
        validRecords++;
      }
    });
    
    // Calculate average production rate
    const averageProductionRate = validRecords > 0 ? (totalProductionRate / validRecords).toFixed(2) : 0;
    
    console.log('\n📊 Summary Statistics:');
    console.log('======================');
    console.log(`Total Records: ${records.length}`);
    console.log(`Valid Records: ${validRecords}`);
    console.log(`Average Production Rate: ${averageProductionRate}%`);
    console.log(`Total Eggs: ${records.reduce((sum, r) => sum + r.eggsCollected, 0)}`);
    console.log(`Total Damaged Eggs: ${records.reduce((sum, r) => sum + (r.damagedEggs || 0), 0)}`);
    console.log(`Effective Eggs: ${records.reduce((sum, r) => sum + r.eggsCollected, 0) - records.reduce((sum, r) => sum + (r.damagedEggs || 0), 0)}`);
    
    // Check if average rate is realistic
    const isAverageRealistic = parseFloat(averageProductionRate) <= 200; // Should be ≤ 200% (2 eggs per bird)
    console.log(`\nAverage Rate Analysis:`);
    console.log(`  Current Average: ${averageProductionRate}%`);
    console.log(`  Realistic Range: 80% - 120% (0.8 - 1.2 eggs per bird)`);
    console.log(`  Status: ${isAverageRealistic ? '✅ Realistic' : '⚠️  High but possible'}`);
    
    if (parseFloat(averageProductionRate) > 120) {
      console.log(`\n⚠️  WARNING: Average production rate is ${averageProductionRate}%, which is above the typical range of 80-120%.`);
      console.log(`   This suggests either very high-performing birds or data entry issues.`);
    }
    
  } catch (error) {
    console.error('❌ Error checking production rates:', error);
  }
};

const main = async () => {
  try {
    await connectDB();
    await checkEggProductionRates();
    console.log('\n🎉 Egg production rate analysis completed!');
  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
};

main();

