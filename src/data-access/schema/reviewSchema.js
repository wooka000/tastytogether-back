const { Schema } = require('mongoose');
const Mongoose = require('mongoose');

const reviewSchema = new Mongoose.Schema(
    {
        grade: { type: String, require: true },
        content: { type: String, require: true },
        usernickname: { type: String, require: true },
        username: { type: String, require: true },
        storeId: { type: Schema.Types.ObjectId, ref: 'Store', require: true },
        userId: { type: Schema.Types.ObjectId, ref: 'Users', require: true },
    },
    { timestamps: true, collection: 'Review' }, // createdAt
);

module.exports = reviewSchema;
