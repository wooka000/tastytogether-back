const { Schema } = require('mongoose');

const tokenSchema = new Schema(
    {
        userId: { type: String, required: true },
        email: { type: String, required: true },
        refreshToken: { type: String, required: true },
    },
    {
        collection: 'RefreshTokens',
    },
);

module.exports = tokenSchema;
