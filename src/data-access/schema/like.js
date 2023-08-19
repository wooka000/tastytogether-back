const { Schema } = require('mongoose');

const likeSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
          },
          boardId: {
            type: Schema.Types.ObjectId,
            ref: 'Board',
            required: true
        },
       },
    {
        collection: 'like',
        timestamps: true,
    },
);

module.exports = likeSchema;