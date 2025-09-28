require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

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

const updateAdminPhone = async () => {
  try {
    console.log('📱 Updating admin phone number...');
    
    // Find the admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log(`📋 Current admin details:`);
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Current Phone: ${adminUser.phone}`);
    console.log(`   Full Name: ${adminUser.fullName}`);

    // Update phone number
    adminUser.phone = '+94741923702';
    await adminUser.save();

    console.log('✅ Admin phone number updated successfully!');
    console.log('📱 New phone number: +94741923702');
    console.log('');
    console.log('🔔 SMS notifications will now be sent to your mobile number when:');
    console.log('   • Admin logs into the system');
    console.log('   • New users are created');
    console.log('   • System alerts are triggered');

  } catch (error) {
    console.error('❌ Error updating admin phone:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
  }
};

// Run the script
connectDB().then(() => {
  updateAdminPhone();
});



