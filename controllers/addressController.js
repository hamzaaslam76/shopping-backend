const Address = require('../Models/addressModel');
const factory = require('./handlerFactory');

exports.getAddresses = factory.getAll(Address);
exports.getAddress = factory.getOne(Address);
exports.createAddress = factory.create(Address);
exports.updateAddress = factory.updateOne(Address);
exports.deleteAddress = factory.deleteOne(Address);


