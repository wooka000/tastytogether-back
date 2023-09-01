const mongoose = require('mongoose');
const tokenSchema = require('../schema/refreshTokenSchema');

exports.RefreshTokens = mongoose.model('RefreshTokens', tokenSchema);
