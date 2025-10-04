const express = require('express');
const emailService = require('../utils/emailService');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// Test email functionality
router.post('/test', catchAsync(async (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      status: 'fail',
      message: 'Email address is required'
    });
  }

  try {
    await emailService.sendTestEmail(email);
    
    res.status(200).json({
      status: 'success',
      message: 'Test email sent successfully',
      data: {
        recipient: email,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to send test email',
      error: error.message
    });
  }
}));

// Send welcome email
router.post('/welcome', catchAsync(async (req, res, next) => {
  const { email, name } = req.body;
  
  if (!email) {
    return res.status(400).json({
      status: 'fail',
      message: 'Email address is required'
    });
  }

  try {
    await emailService.sendWelcomeEmail(email, name);
    
    res.status(200).json({
      status: 'success',
      message: 'Welcome email sent successfully',
      data: {
        recipient: email,
        customerName: name || 'Valued Customer',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to send welcome email',
      error: error.message
    });
  }
}));

// Send product notification email
router.post('/product-notification', catchAsync(async (req, res, next) => {
  const { email, productData } = req.body;
  
  if (!email || !productData) {
    return res.status(400).json({
      status: 'fail',
      message: 'Email address and product data are required'
    });
  }

  try {
    await emailService.sendProductCreatedEmail(productData, email);
    
    res.status(200).json({
      status: 'success',
      message: 'Product notification email sent successfully',
      data: {
        recipient: email,
        productTitle: productData.title,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to send product notification email',
      error: error.message
    });
  }
}));

module.exports = router;
