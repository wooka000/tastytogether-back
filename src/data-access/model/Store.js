const mongoose = require('mongoose');
const StoreSchema = require('../schema/storeSchema')

exports.Store = mongoose.model('Store', StoreSchema);