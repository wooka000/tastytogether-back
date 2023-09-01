const mongoose = require('mongoose');
const userSchema = require('../schema/userSchema');

exports.Users = mongoose.model('Users', userSchema);
