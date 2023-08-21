const mongoose = require('mongoose');

const { Schema } = mongoose;

// Schema 모델 만들기
const StoreSchema = new Schema({
    
    name: {
        type: String,
        required: true,
    },
    address: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Address",
    },
    storeType: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    menuItems: [
        {
            type: mongoose.Types.ObjectId,
            ref: "MenuItems",
        }
    ],
    priceRange: {
        type: String,
        required: true,
    },
    parkingInfo: {
        type: String,
        required: true,
    },
    businessHours:{ 
        type: Array,
        required: false,
    },
    closedDays: {
        type: Array,
        required: true,
    },
    bannerImage: {
        type: String,
        required: true,
    },
    starRating:{
        type: Number,
        default: 0,
    },
    viewCount:{
        type: Number,
        default: 0,
    },   
    reviews: [{
        type: mongoose.Types.ObjectId,
        ref: "Review",
    }],
    storeLikes: [
        {
        type: Schema.Types.ObjectId,
        ref: "User",
        }
    ]
}, {
    timestamps: true,
    collection: "Store",
});

module.exports = StoreSchema;

