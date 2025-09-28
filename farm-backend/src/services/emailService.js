const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'farmabey6@gmail.com',
      pass: process.env.EMAIL_PASS || 'nrzaqflzbtwlmoak' // Gmail App Password
    }
  });
};

// Email addresses for notifications
const EMAIL_ADDRESSES = {
  PERSONAL: 'meshantharusha10@gmail.com',
  FARM: 'farmabey6@gmail.com',
  SYSTEM: 'farmabey6@gmail.com'
};

// Send notification email to both personal and farm emails
const sendNotificationEmail = async (subject, message, type = 'general', data = {}) => {
  try {
    const transporter = createTransporter();
    
    // Create HTML email template
    const htmlContent = createEmailTemplate(subject, message, type, data);
    
    // Send to both personal and farm emails
    const mailOptions = {
      from: EMAIL_ADDRESSES.SYSTEM,
      to: [EMAIL_ADDRESSES.PERSONAL, EMAIL_ADDRESSES.FARM].join(', '),
      subject: `🔔 Farm Management Alert: ${subject}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Notification email sent to both personal and farm emails: ${subject}`);
    
    return {
      success: true,
      message: 'Notification email sent successfully',
      recipients: [EMAIL_ADDRESSES.PERSONAL, EMAIL_ADDRESSES.FARM]
    };
  } catch (error) {
    console.error('Failed to send notification email:', error);
    throw new Error('Failed to send notification email');
  }
};

// Send admin login notification
const sendAdminLoginNotification = async (adminUser) => {
  try {
    const subject = 'Admin Login Detected';
    const message = `Admin user ${adminUser.fullName} has logged into the Farm Management System.`;
    const data = {
      user: adminUser.fullName,
      username: adminUser.username,
      role: adminUser.role,
      loginTime: new Date().toLocaleString(),
      ipAddress: 'System IP'
    };
    
    await sendNotificationEmail(subject, message, 'security', data);
    
    // Also send SMS notification
    const { sendSMS } = require('./smsService');
    const smsMessage = `Admin login detected at ${new Date().toLocaleString()}. Farm Management System.`;
    await sendSMS(adminUser.phone, smsMessage);
    
    console.log(`✅ Admin login notification sent via email and SMS`);
  } catch (error) {
    console.error('Failed to send admin login notification:', error);
  }
};

// Send new user creation notification
const sendNewUserNotification = async (newUser, createdBy) => {
  try {
    const subject = 'New User Created';
    const message = `A new user has been created in the Farm Management System.`;
    const data = {
      newUser: newUser.fullName,
      username: newUser.username,
      role: newUser.role,
      createdBy: createdBy.fullName,
      createdTime: new Date().toLocaleString()
    };
    
    await sendNotificationEmail(subject, message, 'user_management', data);
    
    // Also send SMS to new user
    const { sendSMS } = require('./smsService');
    const smsMessage = `Welcome to Farm Management System! Your account has been created. Username: ${newUser.username}`;
    await sendSMS(newUser.phone, smsMessage);
    
    console.log(`✅ New user notification sent via email and SMS`);
  } catch (error) {
    console.error('Failed to send new user notification:', error);
  }
};

// Send system alerts
const sendSystemAlert = async (alertType, details, severity = 'medium') => {
  try {
    const subject = `System Alert: ${alertType}`;
    const message = `A system alert has been triggered in the Farm Management System.`;
    const data = {
      alertType,
      details,
      severity,
      timestamp: new Date().toLocaleString()
    };
    
    await sendNotificationEmail(subject, message, 'system_alert', data);
    
    console.log(`✅ System alert sent: ${alertType}`);
  } catch (error) {
    console.error('Failed to send system alert:', error);
  }
};

// Send feed inventory alerts
const sendFeedInventoryAlert = async (alertType, items, details) => {
  try {
    const subject = `Feed Inventory Alert: ${alertType}`;
    const message = `Feed inventory requires attention in the Farm Management System.`;
    const data = {
      alertType,
      items,
      details,
      timestamp: new Date().toLocaleString()
    };
    
    await sendNotificationEmail(subject, message, 'inventory_alert', data);
    
    console.log(`✅ Feed inventory alert sent: ${alertType}`);
  } catch (error) {
    console.error('Failed to send feed inventory alert:', error);
  }
};

// Send egg production alerts
const sendEggProductionAlert = async (alertType, details) => {
  try {
    const subject = `Egg Production Alert: ${alertType}`;
    const message = `Egg production data requires attention in the Farm Management System.`;
    const data = {
      alertType,
      details,
      timestamp: new Date().toLocaleString()
    };
    
    await sendNotificationEmail(subject, message, 'production_alert', data);
    
    console.log(`✅ Egg production alert sent: ${alertType}`);
  } catch (error) {
    console.error('Failed to send egg production alert:', error);
  }
};

// Send financial alerts
const sendFinancialAlert = async (alertType, details) => {
  try {
    const subject = `Financial Alert: ${alertType}`;
    const message = `Financial data requires attention in the Farm Management System.`;
    const data = {
      alertType,
      details,
      timestamp: new Date().toLocaleString()
    };
    
    await sendNotificationEmail(subject, message, 'financial_alert', data);
    
    console.log(`✅ Financial alert sent: ${alertType}`);
  } catch (error) {
    console.error('Failed to send financial alert:', error);
  }
};

// Create HTML email template
const createEmailTemplate = (subject, message, type, data) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'security': return '🔐';
      case 'user_management': return '👤';
      case 'system_alert': return '🚨';
      case 'inventory_alert': return '📦';
      case 'production_alert': return '🥚';
      case 'financial_alert': return '💰';
      default: return '🔔';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'security': return '#dc2626';
      case 'user_management': return '#2563eb';
      case 'system_alert': return '#dc2626';
      case 'inventory_alert': return '#ea580c';
      case 'production_alert': return '#16a34a';
      case 'financial_alert': return '#7c3aed';
      default: return '#1e40af';
    }
  };

  const icon = getTypeIcon(type);
  const color = getTypeColor(type);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, ${color}, #1e40af); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">
          ${icon} Farm Management System
        </h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">
          Automated Notification
        </p>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: ${color}; margin-top: 0; border-bottom: 2px solid ${color}; padding-bottom: 10px;">
          ${subject}
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${color};">
          <p style="margin: 0; font-size: 16px; line-height: 1.6;">
            ${message}
          </p>
        </div>

        ${Object.keys(data).length > 0 ? `
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Details:</h3>
            ${Object.entries(data).map(([key, value]) => `
              <p style="margin: 8px 0;"><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${value}</p>
            `).join('')}
          </div>
        ` : ''}

        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
          <h3 style="color: #166534; margin-top: 0;">📧 Notification Details</h3>
          <p style="margin: 5px 0;"><strong>Sent to:</strong> Personal Email (meshantharusha10@gmail.com) & Farm Email (farmabey6@gmail.com)</p>
          <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>System:</strong> Abeyrathne Enterprises Farm Management</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            This is an automated notification from the Farm Management System.
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
            © 2024 Abeyrathne Enterprises. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
};

// Test email configuration
const testEmailConfiguration = async () => {
  try {
    const subject = 'Email Configuration Test';
    const message = 'This is a test email to verify that the email notification system is working correctly.';
    const data = {
      testType: 'Configuration Test',
      timestamp: new Date().toISOString(),
      status: 'Working'
    };
    
    await sendNotificationEmail(subject, message, 'system_alert', data);
    
    console.log('✅ Email configuration test successful!');
    return { success: true, message: 'Test email sent successfully' };
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return { success: false, message: 'Test email failed', error: error.message };
  }
};

module.exports = {
  sendNotificationEmail,
  sendAdminLoginNotification,
  sendNewUserNotification,
  sendSystemAlert,
  sendFeedInventoryAlert,
  sendEggProductionAlert,
  sendFinancialAlert,
  testEmailConfiguration,
  EMAIL_ADDRESSES
};
