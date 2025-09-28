# 📧 Email Notification System Setup Guide

## 🎯 **Your Email Addresses Configured:**
- **Personal Email:** `meshantharusha10@gmail.com`
- **Farm Email:** `farmabey6@gmail.com`
- **System Email:** `farmabey6@gmail.com` (Main system email)

## 🔧 **Setup Steps:**

### Step 1: Configure Gmail App Password

1. **Go to Google Account Security**: https://myaccount.google.com/security
2. **Enable 2-Step Verification** (if not already enabled)
3. **Go to App Passwords**: https://myaccount.google.com/apppasswords
4. **Generate New App Password**:
   - Select "Mail"
   - Select "Other (Custom name)"
   - Enter "Farm Management System"
   - **Copy the 16-character password** (remove spaces)

### Step 2: Update Email Configuration

Create or update your `.env` file in the `farm-backend` directory:

```env
# Email Configuration
EMAIL_USER=farmabey6@gmail.com
EMAIL_PASS=your-16-character-app-password-here

# Your Email Addresses
PERSONAL_EMAIL=meshantharusha10@gmail.com
FARM_EMAIL=farmabey6@gmail.com

# Database Configuration
PORT=5000
MONGO_URI=mongodb+srv://codez:codez123@codez.7wxzojy.mongodb.net/farm_management?retryWrites=true&w=majority
DB_NAME=farm_management
JWT_SECRET=your_jwt_secret_key_here_change_in_production_2024
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 3: Test Email System

After updating the `.env` file, restart the server and test:

```bash
# Restart the server
npm start

# Test email notifications
curl http://localhost:5000/api/notifications/test
```

## 🚀 **Email Notification Features:**

### ✅ **Automatic Notifications:**
1. **Admin Login Alerts** - Sent to both your emails when admin logs in
2. **New User Creation** - Notifications when new users are added
3. **System Alerts** - General system notifications
4. **Feed Inventory Alerts** - Low stock, expiry warnings
5. **Egg Production Alerts** - Production issues, anomalies
6. **Financial Alerts** - Financial data alerts

### 📧 **Email Templates:**
- **Professional HTML emails** with farm branding
- **Color-coded alerts** by type (security, inventory, production, etc.)
- **Detailed information** with timestamps and system data
- **Responsive design** that works on all devices

### 🔔 **Notification Triggers:**
- **Admin Login:** Every time admin logs into the system
- **User Management:** When new users are created or modified
- **Inventory Alerts:** When feed stock is low or expiring
- **Production Alerts:** When egg production data needs attention
- **Financial Alerts:** When financial data requires review

## 🧪 **Testing Commands:**

### Test Email Configuration:
```bash
curl http://localhost:5000/api/notifications/test
```

### Test System Alert:
```bash
curl -X POST http://localhost:5000/api/notifications/system-alert \
  -H "Content-Type: application/json" \
  -d '{
    "alertType": "Test Alert",
    "details": "This is a test system alert",
    "severity": "low"
  }'
```

### Test Feed Inventory Alert:
```bash
curl -X POST http://localhost:5000/api/notifications/feed-inventory-alert \
  -H "Content-Type: application/json" \
  -d '{
    "alertType": "Low Stock Alert",
    "items": ["Layer Feed", "Chick Starter"],
    "details": "Feed inventory is running low"
  }'
```

## 🔍 **Troubleshooting:**

### Common Issues:

1. **"Invalid login" Error**
   - Make sure you're using App Password, not regular password
   - Verify 2FA is enabled on Gmail account
   - Check that the App Password is correct (16 characters, no spaces)
   - Wait 5-10 minutes after creating App Password

2. **"Connection timeout" Error**
   - Check internet connection
   - Verify firewall settings
   - Try different email provider

3. **"Authentication failed" Error**
   - Regenerate App Password
   - Check for typos in credentials
   - Verify email address is correct

### Manual Test:
```bash
# Run the email test script
node test-email.js
```

## 📊 **Current Status:**

- ✅ **Email Service Created** - Complete notification system
- ✅ **Email Templates** - Professional HTML templates
- ✅ **API Endpoints** - Ready for testing
- ✅ **Your Email Addresses** - Configured for notifications
- ⚠️ **Gmail Credentials** - Need proper App Password setup

## 🎉 **Once Configured:**

1. **Admin login notifications** will be sent to both your emails
2. **System alerts** will keep you informed of farm operations
3. **Professional email templates** will maintain your brand
4. **Real-time notifications** for all important events

## 📞 **Support:**

If you need help:
1. Check the error logs in the terminal
2. Verify your Gmail App Password is correct
3. Make sure 2FA is enabled on your Google account
4. Test with the provided commands

**The email notification system is ready - just needs your Gmail App Password!** 🚀
