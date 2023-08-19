const Mongoose = require('mongoose');

const reviewSchema = new Mongoose.Schema(
    {
        id: { type: Number, require: true },
        grade: { type: String, require: true },
        content: { type: String, require: true },
        usernickname: { type: String, require: true },
        username: { type: String, require: true },
        storeId: { type: String, require: true },
    },
    { timestamps: true }, // createdAt
);

module.exports = reviewSchema;
