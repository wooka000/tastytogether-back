// userSchema.js
// src/data-access/schema에 넣어주시면 됩니다!

const { Schema } = require('mongoose');

const tokenSchema = new Schema(
    {
        userId: { type: String, required: true },
        email: { type: String, required: true },
        token: { type: String, required: true },
    },
    {
        collection: 'tokens',
    },
);

module.exports = tokenSchema;
