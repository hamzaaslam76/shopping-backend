const express = require('express');
const couponController = require('../controllers/couponController');

const router = express.Router();

router
  .route('/')
  .get(couponController.getCoupons)
  .post(couponController.createCoupon);

router
  .route('/:id')
  .get(couponController.getCoupon)
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

module.exports = router;
