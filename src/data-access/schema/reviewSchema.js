const Mongoose = require('mongoose');

const reviewSchema = new Mongoose.Schema(
    {
        grade: { type: String, require: true },
        content: { type: String, require: true },
        usernickname: { type: String, require: true },
        username: { type: String, require: true },
        storeId: { type: String, require: true },
    },
    { timestamps: true, collection: 'Review' }, // createdAt
);

module.exports = reviewSchema;
