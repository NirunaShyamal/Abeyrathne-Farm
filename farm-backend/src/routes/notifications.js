const express = require('express');
const router = express.Router();
const { 
  testEmailConfiguration,
  sendSystemAlert,
  sendFeedInventoryAlert,
  sendEggProductionAlert,
  sendFinancialAlert
} = require('../services/emailService');

// @desc    Test email notification system
// @route   GET /api/notifications/test
// @access  Public
router.get('/test', async (req, res) => {
  try {
    const result = await testEmailConfiguration();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Email notification test successful! Check both your personal and farm email inboxes.',
        details: {
          personalEmail: 'meshantharusha10@gmail.com',
          farmEmail: 'farmabey6@gmail.com',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Email notification test failed',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Notification test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test email notifications',
      error: error.message
    });
  }
});

// @desc    Send system alert notification
// @route   POST /api/notifications/system-alert
// @access  Public
router.post('/system-alert', async (req, res) => {
  try {
    const { alertType, details, severity } = req.body;
    
    if (!alertType) {
      return res.status(400).json({
        success: false,
        message: 'Alert type is required'
      });
    }
    
    await sendSystemAlert(alertType, details, severity);
    
    res.status(200).json({
      success: true,
      message: 'System alert notification sent successfully',
      alertType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('System alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send system alert',
      error: error.message
    });
  }
});

// @desc    Send feed inventory alert
// @route   POST /api/notifications/feed-inventory-alert
// @access  Public
router.post('/feed-inventory-alert', async (req, res) => {
  try {
    const { alertType, items, details } = req.body;
    
    if (!alertType) {
      return res.status(400).json({
        success: false,
        message: 'Alert type is required'
      });
    }
    
    await sendFeedInventoryAlert(alertType, items, details);
    
    res.status(200).json({
      success: true,
      message: 'Feed inventory alert sent successfully',
      alertType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Feed inventory alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send feed inventory alert',
      error: error.message
    });
  }
});

// @desc    Send egg production alert
// @route   POST /api/notifications/egg-production-alert
// @access  Public
router.post('/egg-production-alert', async (req, res) => {
  try {
    const { alertType, details } = req.body;
    
    if (!alertType) {
      return res.status(400).json({
        success: false,
        message: 'Alert type is required'
      });
    }
    
    await sendEggProductionAlert(alertType, details);
    
    res.status(200).json({
      success: true,
      message: 'Egg production alert sent successfully',
      alertType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Egg production alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send egg production alert',
      error: error.message
    });
  }
});

// @desc    Send financial alert
// @route   POST /api/notifications/financial-alert
// @access  Public
router.post('/financial-alert', async (req, res) => {
  try {
    const { alertType, details } = req.body;
    
    if (!alertType) {
      return res.status(400).json({
        success: false,
        message: 'Alert type is required'
      });
    }
    
    await sendFinancialAlert(alertType, details);
    
    res.status(200).json({
      success: true,
      message: 'Financial alert sent successfully',
      alertType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Financial alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send financial alert',
      error: error.message
    });
  }
});

module.exports = router;


