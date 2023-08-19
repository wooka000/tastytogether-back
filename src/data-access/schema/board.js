const { Schema,model } = require('mongoose');

const boardListSchema = new Schema(
    {
        userId: {
            type: Number,
            // ref: 'User',
            required: true,
        },
        storeId: {
            // type: Schema.Types.ObjectId,
            type: Number,
            // ref: 'Store',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        meetDate: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'boardList',
        timestamps: true,
    },
);

module.exports = model('Board', boardListSchema);
