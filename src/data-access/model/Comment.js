const mongoose = require('mongoose');

// eslint-disable-next-line import/extensions
const commentSchema = require ('../schema/commentSchema.js')


module.exports = mongoose.model('Comment', commentSchema);