const { Schema } = require('mongoose');

const commentSchema = new Schema(
    {
        userId: {
            type: Number,
            // ref: 'Users',
            required: true,
          },
        content: {
            type: String,
            required: true,
        },
        boardId: {
            type: Schema.Types.ObjectId,
            ref: 'Board',
            required: true
        },
    },
    {
        collection: 'comment',
        timestamps: true,
    },
);

module.exports = commentSchema;