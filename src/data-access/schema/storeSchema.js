const mongoose = require('mongoose');

const { Schema } = mongoose;

const StoreSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Address',
        },
        type: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: false,
        },
        menuItems: [
            {
                type: Schema.Types.ObjectId,
                ref: 'MenuItems',
            },
        ],
        priceRange: {
            type: String,
            required: true,
        },
        parkingInfo: {
            type: String,
            required: true,
        },
        businessHours: {
            type: Array,
            required: false,
        },
        closedDays: {
            type: Array,
            required: true,
        },
        banners: {
            type: Array,
            required: true,
        },
        starRating: {
            type: Number,
            default: 0,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],
        storeLikes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Users',
            },
        ],
    },
    {
        timestamps: true,
        collection: 'Store',
    },
);

module.exports = StoreSchema;
