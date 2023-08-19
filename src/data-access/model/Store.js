const mongoose = require('mongoose');
const StoreSchema = require('../schema/store')

exports.Store = mongoose.model('Store', StoreSchema);