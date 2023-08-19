const mongoose = require('mongoose');
const AddressSchema = require('../schema/address')

exports.Address = mongoose.model('address', AddressSchema);