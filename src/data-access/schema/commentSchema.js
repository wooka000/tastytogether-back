const { Schema } = require('mongoose');

const commentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        boardId: {
            type: Schema.Types.ObjectId,
            ref: 'Board',
            required: true,
        },
    },
    {
        collection: 'Comment',
        timestamps: true,
    },
);

module.exports = commentSchema;
