const { Schema } = require('mongoose');
const Mongoose = require('mongoose');

const reviewSchema = new Mongoose.Schema(
    {
        grade: { type: String, required: true },
        content: { type: String, required: true },
        usernickname: { type: String, required: true },
        username: { type: String, required: true },
        storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        photos: {
            type: [String],
        },
    },
    { timestamps: true, collection: 'Review' }, // createdAt
);

module.exports = reviewSchema;
