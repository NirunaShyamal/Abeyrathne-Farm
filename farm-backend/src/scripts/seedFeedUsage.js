require('dotenv').config();
const connectDB = require('../config/database');
const FeedUsage = require('../models/FeedUsage');
const FeedStock = require('../models/FeedStock');

async function main() {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Ensure an active stock exists for Layer Feed
    let stock = await FeedStock.findOne({ feedType: 'Layer Feed', status: 'Active' });
    if (!stock) {
      const month = new Date().toISOString().slice(0, 7);
      stock = await FeedStock.create({
        feedType: 'Layer Feed',
        type: 'Layer Feed',
        month,
        baselineQuantity: 2000,
        currentQuantity: 2000,
        supplier: 'Seeder Supplier',
        costPerUnit: 150,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        status: 'Active'
      });
      console.log('🧺 Created seed stock for Layer Feed');
    }

    // Create 7 days of usage
    const today = new Date();
    const records = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const quantityUsed = 40 + Math.floor(Math.random() * 15); // 40-54 KG
      const totalBirds = 500;
      const costPerKg = stock.costPerUnit;

      records.push({
        feedType: 'Layer Feed',
        date: dateStr,
        quantityUsed,
        totalBirds,
        feedingTime: 'Full Day',
        recordedBy: 'Seeder',
        weather: ['Sunny', 'Rainy', 'Cloudy'][i % 3],
        temperature: 28 + (i % 5),
        humidity: 60 + (i % 10),
        wastePercentage: 2 + (i % 3),
        location: 'Main Coop',
        costAnalysis: {
          costPerKg,
          dailyCost: quantityUsed * costPerKg,
          costPerBird: ((quantityUsed * costPerKg) / totalBirds).toFixed(2)
        },
        qualityObservations: {
          birdAppearance: 'Good',
          feedAcceptance: 'Good',
          waterConsumption: 'Normal'
        },
        healthIndicators: {
          mortality: 0,
          eggProduction: 0,
          averageWeight: 0
        },
        verified: true
      });
    }

    // Remove duplicates for the same dates if re-run
    const dates = records.map(r => r.date);
    await FeedUsage.deleteMany({ feedType: 'Layer Feed', date: { $in: dates } });

    const inserted = await FeedUsage.insertMany(records);
    console.log(`🥚 Inserted ${inserted.length} feed usage records`);

    // Adjust stock currentQuantity
    const totalUsed = records.reduce((s, r) => s + r.quantityUsed, 0);
    stock.currentQuantity = Math.max(0, stock.currentQuantity - totalUsed);
    await stock.save();
    console.log(`📉 Deducted ${totalUsed} KG from stock. Remaining: ${stock.currentQuantity} KG`);

    console.log('✅ Seed complete');
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    process.exit(0);
  }
}

main();


