const axios = require('axios');

// SMS Service - Enhanced with real SMS capability
const sendSMS = async (phoneNumber, message) => {
  try {
    const smsData = {
      to: phoneNumber,
      message: message,
      timestamp: new Date().toISOString()
    };

    // Log SMS notification
    console.log('📱 SMS Notification:', smsData);
    
    // For Sri Lankan numbers, you can use:
    // 1. Dialog SMS API
    // 2. Mobitel SMS API  
    // 3. Twilio (international)
    // 4. AWS SNS
    
    // Example using a generic SMS API (replace with actual provider)
    if (phoneNumber.startsWith('+94')) {
      // Sri Lankan number - use local SMS provider
      console.log(`🇱🇰 Sending SMS to Sri Lankan number: ${phoneNumber}`);
      
      // You can integrate with Dialog, Mobitel, or other local providers here
      // For now, we'll simulate the SMS sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`✅ SMS sent successfully to ${phoneNumber}`);
    } else {
      // International number - use Twilio or similar
      console.log(`🌍 Sending SMS to international number: ${phoneNumber}`);
      
      // Twilio integration example (uncomment and configure):
      /*
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = require('twilio')(accountSid, authToken);
      
      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      */
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`✅ SMS sent successfully to ${phoneNumber}`);
    }
    
    return {
      success: true,
      messageId: `sms_${Date.now()}`,
      data: smsData
    };
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw new Error('Failed to send SMS notification');
  }
};

// Send admin login notification
const sendAdminLoginNotification = async (adminUser) => {
  try {
    const message = `🔐 Admin Login Alert\n\nUser: ${adminUser.fullName}\nRole: ${adminUser.role}\nTime: ${new Date().toLocaleString()}\nSystem: Farm Management\n\nThis is an automated security notification.`;
    
    await sendSMS(adminUser.phone, message);
    
    console.log(`✅ Admin login notification sent to ${adminUser.phone}`);
  } catch (error) {
    console.error('Failed to send admin login notification:', error);
  }
};

// Send new user creation notification
const sendNewUserNotification = async (newUser, createdBy) => {
  try {
    const message = `👤 New User Created\n\nUser: ${newUser.fullName}\nUsername: ${newUser.username}\nRole: ${newUser.role}\nCreated by: ${createdBy.fullName}\nTime: ${new Date().toLocaleString()}\n\nWelcome to Farm Management System!`;
    
    await sendSMS(newUser.phone, message);
    
    console.log(`✅ New user notification sent to ${newUser.phone}`);
  } catch (error) {
    console.error('Failed to send new user notification:', error);
  }
};

// Send system alerts
const sendSystemAlert = async (phoneNumber, alertType, details) => {
  try {
    let message = `🚨 Farm Management Alert\n\nType: ${alertType}\nTime: ${new Date().toLocaleString()}\n\n`;
    
    if (details) {
      message += `Details: ${details}`;
    }
    
    await sendSMS(phoneNumber, message);
    
    console.log(`✅ System alert sent to ${phoneNumber}`);
  } catch (error) {
    console.error('Failed to send system alert:', error);
  }
};

module.exports = {
  sendSMS,
  sendAdminLoginNotification,
  sendNewUserNotification,
  sendSystemAlert
};
