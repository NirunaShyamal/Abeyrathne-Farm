require('dotenv').config();
const mongoose = require('mongoose');
const FeedInventory = require('../models/FeedInventory');
const FeedStock = require('../models/FeedStock');

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

const fixFeedInventoryIntegration = async () => {
  try {
    console.log('🔧 Fixing feed inventory integration...');
    
    // Get all feed inventory items
    const feedInventoryItems = await FeedInventory.find();
    console.log(`📊 Found ${feedInventoryItems.length} feed inventory items`);
    
    // Get all feed stock items
    const feedStockItems = await FeedStock.find();
    console.log(`📊 Found ${feedStockItems.length} feed stock items`);
    
    // Update feed stock items to have proper field names for frontend compatibility
    for (const stockItem of feedStockItems) {
      console.log(`🔄 Updating feed stock item: ${stockItem._id}`);
      
      // Ensure feedType field exists (frontend expects this)
      if (!stockItem.feedType && stockItem.type) {
        stockItem.feedType = stockItem.type;
      }
      
      // Ensure currentQuantity field exists (frontend expects this)
      if (!stockItem.currentQuantity && stockItem.quantity) {
        stockItem.currentQuantity = stockItem.quantity;
      }
      
      // Add missing fields that frontend expects
      if (!stockItem.minimumThreshold) {
        stockItem.minimumThreshold = 100; // Default threshold
      }
      
      if (!stockItem.status) {
        stockItem.status = 'Active';
      }
      
      if (!stockItem.expiryDate) {
        // Set expiry date to 6 months from now
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 6);
        stockItem.expiryDate = expiryDate.toISOString().split('T')[0];
      }
      
      // Calculate days until expiry
      const today = new Date();
      const expiry = new Date(stockItem.expiryDate);
      const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      stockItem.daysUntilExpiry = Math.max(0, daysUntilExpiry);
      
      // Check if low stock
      stockItem.isLowStock = stockItem.currentQuantity <= stockItem.minimumThreshold;
      
      await stockItem.save();
      console.log(`✅ Updated: ${stockItem.feedType} - ${stockItem.currentQuantity} KG`);
    }
    
    // If no feed stock items exist, create one from feed inventory
    if (feedStockItems.length === 0 && feedInventoryItems.length > 0) {
      console.log('📦 Creating feed stock items from feed inventory...');
      
      for (const inventoryItem of feedInventoryItems) {
        const stockItem = new FeedStock({
          feedType: inventoryItem.type,
          type: inventoryItem.type, // Keep both for compatibility
          currentQuantity: inventoryItem.quantity,
          quantity: inventoryItem.quantity, // Keep both for compatibility
          supplier: inventoryItem.supplier,
          supplierContact: inventoryItem.supplierContact || '',
          costPerUnit: inventoryItem.costPerUnit || 0,
          minimumThreshold: inventoryItem.minimumThreshold || 100,
          status: 'Active',
          expiryDate: inventoryItem.expiryDate || (() => {
            const date = new Date();
            date.setMonth(date.getMonth() + 6);
            return date.toISOString().split('T')[0];
          })(),
          location: inventoryItem.location || 'Main Storage',
          notes: inventoryItem.notes || ''
        });
        
        // Calculate days until expiry
        const today = new Date();
        const expiry = new Date(stockItem.expiryDate);
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        stockItem.daysUntilExpiry = Math.max(0, daysUntilExpiry);
        
        // Check if low stock
        stockItem.isLowStock = stockItem.currentQuantity <= stockItem.minimumThreshold;
        
        await stockItem.save();
        console.log(`✅ Created feed stock: ${stockItem.feedType} - ${stockItem.currentQuantity} KG`);
      }
    }
    
    // Show final summary
    const updatedFeedStock = await FeedStock.find();
    console.log('\n📋 Updated Feed Stock Summary:');
    console.log('=====================================');
    
    updatedFeedStock.forEach(item => {
      console.log(`📦 ${item.feedType}: ${item.currentQuantity} KG (${item.status})`);
      console.log(`   Supplier: ${item.supplier}`);
      console.log(`   Expiry: ${item.expiryDate} (${item.daysUntilExpiry} days)`);
      console.log(`   Low Stock: ${item.isLowStock ? 'Yes' : 'No'}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ Error fixing feed inventory integration:', error);
  }
};

const main = async () => {
  try {
    await connectDB();
    await fixFeedInventoryIntegration();
    console.log('\n🎉 Feed inventory integration fix completed!');
  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
};

main();

