const mongoose = require('mongoose');

// eslint-disable-next-line import/extensions
const commentSchema = require('../schema/commentSchema.js');

exports.Comment = mongoose.model('Comment', commentSchema);