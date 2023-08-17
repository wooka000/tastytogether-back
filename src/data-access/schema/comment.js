const { Schema } = require('mongoose');

const commentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
          },
        content: {
            type: String,
            required: true,
        },
        boardId: {
            type: Schema.Types.ObjectId,
            ref: 'board',
            required: true
        },
        writeDate: {
            type: Date,
            default: () => new Date().toISOString().split('T')[0],
            required: true,
          },

    },
    {
        collection: 'comment',
        timestamps: true,
    },
);

module.exports = commentSchema;