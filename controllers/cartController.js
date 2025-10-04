const Cart = require('../Models/cartModel');
const factory = require('./handlerFactory');

exports.getCarts = factory.getAll(Cart);
exports.getCart = factory.getOne(Cart, { path: 'items.product' });
exports.createCart = factory.create(Cart);
exports.updateCart = factory.updateOne(Cart);
exports.deleteCart = factory.deleteOne(Cart);


