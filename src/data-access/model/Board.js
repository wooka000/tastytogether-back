const mongoose = require('mongoose');

const boardListSchema = require ('../schema/boardSchema.js')


module.exports = mongoose.model('Board', boardListSchema);


