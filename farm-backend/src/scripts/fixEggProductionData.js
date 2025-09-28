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

const fixEggProductionData = async () => {
  try {
    console.log('🔧 Fixing egg production data to realistic values...');
    
    const records = await EggProduction.find();
    console.log(`📊 Found ${records.length} records to fix`);
    
    let fixedCount = 0;
    
    for (const record of records) {
      const eggsPerBird = record.birds > 0 ? (record.eggsCollected / record.birds) : 0;
      
      if (eggsPerBird > 2) {
        console.log(`\n🔄 Fixing record ${record._id}:`);
        console.log(`  Original: ${record.eggsCollected} eggs from ${record.birds} birds (${eggsPerBird.toFixed(2)} eggs/bird)`);
        
        // Fix to realistic values (0.8-1.2 eggs per bird per day)
        const realisticEggsPerBird = 0.8 + Math.random() * 0.4; // Random between 0.8 and 1.2
        const newEggsCollected = Math.round(record.birds * realisticEggsPerBird);
        const newDamagedEggs = Math.round(newEggsCollected * (0.02 + Math.random() * 0.03)); // 2-5% damage rate
        
        record.eggsCollected = newEggsCollected;
        record.damagedEggs = newDamagedEggs;
        
        // Recalculate production rate
        record.eggProductionRate = parseFloat(((newEggsCollected / record.birds) * 100).toFixed(2));
        
        await record.save();
        
        console.log(`  Fixed: ${newEggsCollected} eggs from ${record.birds} birds (${realisticEggsPerBird.toFixed(2)} eggs/bird)`);
        console.log(`  Damaged: ${newDamagedEggs} eggs (${((newDamagedEggs / newEggsCollected) * 100).toFixed(1)}% damage rate)`);
        console.log(`  Production Rate: ${record.eggProductionRate}%`);
        
        fixedCount++;
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} records`);
    
    // Show updated summary
    const updatedRecords = await EggProduction.find().sort({ date: -1 });
    console.log('\n📋 Updated Records Summary:');
    console.log('=====================================');
    
    updatedRecords.forEach(record => {
      const eggsPerBird = record.birds > 0 ? (record.eggsCollected / record.birds).toFixed(2) : 0;
      const damageRate = record.eggsCollected > 0 ? ((record.damagedEggs / record.eggsCollected) * 100).toFixed(1) : 0;
      console.log(`📅 ${record.date} | Batch: ${record.batchNumber} | Birds: ${record.birds} | Eggs: ${record.eggsCollected} | Rate: ${record.eggProductionRate}% | Eggs/Bird: ${eggsPerBird} | Damage: ${damageRate}%`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing data:', error);
  }
};

const main = async () => {
  try {
    await connectDB();
    await fixEggProductionData();
    console.log('\n🎉 Egg production data fix completed!');
  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
};

main();

