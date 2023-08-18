// userSchema.js
// src/data-access/schema에 넣어주시면 됩니다!

const { Schema } = require('mongoose');

const userSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        nickname: { type: String, required: true },
        profileImage: { type: String },
        profileText: { type: String },
        isAdmin: { type: Boolean, required: false },
        coverImage: { type: String },
        storeLikeList: [{ type: String }],
    },
    {
        collection: 'Users',
    },
);

module.exports = userSchema;
