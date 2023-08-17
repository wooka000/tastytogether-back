const { Schema } = require('mongoose');

const boardListSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
          },
        store: {
            type: Schema.Types.ObjectId,
            ref: 'store',
            required: true,
          },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: Number,
            required: true,
        },
        writeDate: {
            type: Date,
            default: () => new Date().toISOString().split('T')[0],
            required: true,
          },

    },
    {
        collection: 'boardList',
        timestamps: true,
    },
);

module.exports = boardListSchema;

