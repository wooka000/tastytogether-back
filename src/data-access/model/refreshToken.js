// user.js
// src/data-access/model에 넣어주시면 됩니다!

const mongoose = require('mongoose');
const tokenSchema = require('../schema/refreshTokenSchema');

exports.RefreshTokens = mongoose.model('RefreshTokens', tokenSchema);
