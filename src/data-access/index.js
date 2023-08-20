// index.js
// src/data-access/index.js에 넣어주시면 됩니다!
const { Users } = require('./model/user');
const { RefreshTokens } = require('./model/refreshToken');

module.exports = { Users, RefreshTokens };
