const catchAsync = require('../utils/catchAsync');
const pinataService = require('../utils/pinataService');
const multer = require('multer');
const AppError = require('../utils/appError');

// Configure multer for testing
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

exports.uploadTestImage = upload.single('image');

// Test Pinata connection
exports.testPinataConnection = catchAsync(async (req, res, next) => {
  try {
    const isAuthenticated = await pinataService.testConnection();
    
    if (isAuthenticated) {
      const accountInfo = await pinataService.getAccountInfo();
      
      res.status(200).json({
        status: 'success',
        message: 'Pinata connection successful',
        data: {
          authenticated: true,
          accountInfo: {
            pinCount: accountInfo.pin_count,
            pinSize: accountInfo.pin_size,
            pinSizeMB: (accountInfo.pin_size / 1024 / 1024).toFixed(2)
          }
        }
      });
    } else {
      res.status(401).json({
        status: 'error',
        message: 'Pinata authentication failed',
        data: {
          authenticated: false
        }
      });
    }
  } catch (error) {
    console.error('Pinata connection test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to test Pinata connection',
      error: error.message
    });
  }
});

// Test image upload to Pinata
exports.testImageUpload = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No image file provided', 400));
  }

  try {
    const uploadResult = await pinataService.uploadFile(req.file, {
      name: `test_image_${Date.now()}_${req.file.originalname}`,
      type: 'test-image',
      metadata: {
        testUpload: true,
        uploadedAt: new Date().toISOString()
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Image uploaded to Pinata successfully',
      data: {
        uploadResult
      }
    });
  } catch (error) {
    console.error('Pinata upload test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload image to Pinata',
      error: error.message
    });
  }
});

// Get Pinata account information
exports.getPinataAccountInfo = catchAsync(async (req, res, next) => {
  try {
    const accountInfo = await pinataService.getAccountInfo();
    
    res.status(200).json({
      status: 'success',
      data: {
        accountInfo
      }
    });
  } catch (error) {
    console.error('Get account info error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get account information',
      error: error.message
    });
  }
});
