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
    },
    {
        collection: 'Users',
    },
);

module.exports = userSchema;
