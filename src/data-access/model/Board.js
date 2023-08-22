const mongoose = require('mongoose');

// eslint-disable-next-line import/extensions
const boardListSchema = require ('../schema/boardSchema.js')


exports.Board = mongoose.model('Board', boardListSchema);
