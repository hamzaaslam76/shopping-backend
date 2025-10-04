const express = require('express');
const addressController = require('../controllers/addressController');

const router = express.Router();

router
  .route('/')
  .get(addressController.getAddresses)
  .post(addressController.createAddress);

router
  .route('/:id')
  .get(addressController.getAddress)
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

module.exports = router;
