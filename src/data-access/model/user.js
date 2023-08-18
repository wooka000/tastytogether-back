// user.js
// src/data-access/model에 넣어주시면 됩니다!

const mongoose = require('mongoose');
const userSchema = require('../schema/userSchema');

exports.User = mongoose.model('Users', userSchema);
