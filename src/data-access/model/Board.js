const mongoose = require('mongoose');

// eslint-disable-next-line import/extensions
const boardListSchema = require ('../schema/boardSchema.js')


module.exports = mongoose.model('Board', boardListSchema);


