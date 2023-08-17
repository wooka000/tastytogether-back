const { Schema } = require('mongoose');

const likeSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
          },
          boardId: {
            type: Schema.Types.ObjectId,
            ref: 'board',
            required: true
        },
       },
    {
        collection: 'like',
        timestamps: true,
    },
);

module.exports = likeSchema;