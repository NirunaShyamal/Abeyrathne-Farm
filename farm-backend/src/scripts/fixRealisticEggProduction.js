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

const fixRealisticEggProduction = async () => {
  try {
    console.log('🔧 Fixing egg production data to realistic values...');
    
    const records = await EggProduction.find();
    console.log(`📊 Found ${records.length} records to fix`);
    
    let fixedCount = 0;
    
    for (const record of records) {
      console.log(`\n🔍 Processing record: ${record.batchNumber}`);
      console.log(`   Current: ${record.birds} birds, ${record.eggsCollected} eggs (${record.eggProductionRate}%)`);
      
      // Calculate realistic eggs collected based on production rate
      // Realistic production rates: 70-90% (0.7-0.9 eggs per bird per day)
      const realisticProductionRate = Math.random() * 20 + 70; // 70-90% range
      const realisticEggsCollected = Math.floor((record.birds * realisticProductionRate) / 100);
      
      // Calculate realistic damaged eggs (2-5% of total eggs)
      const damageRate = Math.random() * 3 + 2; // 2-5% damage rate
      const realisticDamagedEggs = Math.floor((realisticEggsCollected * damageRate) / 100);
      
      // Update the record
      record.eggsCollected = realisticEggsCollected;
      record.damagedEggs = realisticDamagedEggs;
      
      // Recalculate production rate
      if (record.birds > 0) {
        record.eggProductionRate = parseFloat(((realisticEggsCollected / record.birds) * 100).toFixed(2));
      }
      
      await record.save();
      
      console.log(`   Fixed: ${record.birds} birds, ${record.eggsCollected} eggs (${record.eggProductionRate}%)`);
      console.log(`   Damaged: ${record.damagedEggs} eggs (${((record.damagedEggs / record.eggsCollected) * 100).toFixed(1)}%)`);
      
      fixedCount++;
    }
    
    console.log(`\n✅ Successfully fixed ${fixedCount} egg production records`);
    console.log('\n📊 Updated Production Rates:');
    console.log('============================');
    
    const updatedRecords = await EggProduction.find();
    updatedRecords.forEach(record => {
      console.log(`Batch ${record.batchNumber}: ${record.eggProductionRate}% (${record.eggsCollected}/${record.birds} = ${(record.eggsCollected/record.birds).toFixed(2)} eggs/bird)`);
    });
    
    // Calculate new average
    const totalEggs = updatedRecords.reduce((sum, record) => sum + record.eggsCollected, 0);
    const totalBirds = updatedRecords.reduce((sum, record) => sum + record.birds, 0);
    const averageRate = totalBirds > 0 ? (totalEggs / totalBirds) * 100 : 0;
    
    console.log(`\n📈 New Average Production Rate: ${averageRate.toFixed(2)}%`);
    console.log(`📈 New Average Eggs per Bird: ${(totalEggs / totalBirds).toFixed(2)}`);
    
    if (averageRate >= 70 && averageRate <= 90) {
      console.log('✅ Production rates are now realistic!');
    } else {
      console.log('⚠️  Production rates may still need adjustment');
    }
    
  } catch (error) {
    console.error('❌ Error fixing egg production data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
  }
};

// Run the fix
connectDB().then(() => {
  fixRealisticEggProduction();
});

