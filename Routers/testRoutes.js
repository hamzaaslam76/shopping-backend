const express = require('express');
const testController = require('../controllers/testController');

const router = express.Router();

// Test routes for Pinata integration
router.route('/pinata/connection')
  .get(testController.testPinataConnection);

router.route('/pinata/account')
  .get(testController.getPinataAccountInfo);

router.route('/pinata/upload')
  .post(
    testController.uploadTestImage,
    testController.testImageUpload
  );

module.exports = router;
