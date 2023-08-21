const mongoose = require('mongoose');
const AddressSchema = require('../schema/addressSchema')

exports.Address = mongoose.model('Address', AddressSchema);