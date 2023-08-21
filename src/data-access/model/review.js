const mongoose = require('mongoose');
const reviewSchema = require('../schema/reviewSchema');

exports.Review = mongoose.model('Review', reviewSchema);
