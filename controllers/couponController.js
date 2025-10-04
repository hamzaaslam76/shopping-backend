const Coupon = require('../Models/couponModel');
const factory = require('./handlerFactory');

exports.getCoupons = factory.getAll(Coupon);
exports.getCoupon = factory.getOne(Coupon);
exports.createCoupon = factory.create(Coupon);
exports.updateCoupon = factory.updateOne(Coupon);
exports.deleteCoupon = factory.deleteOne(Coupon);


