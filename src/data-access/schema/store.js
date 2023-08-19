const mongoose = require('mongoose');

const { Schema } = mongoose;

// Schema 모델 만들기
const StoreSchema = new Schema(
    {
        // MongoDB에서는 일반적으로 고유 식별자인 _id를 자동으로 생성해 주기때문에 _id가 자동 생성되기를 원하면 id 속성을 추가할 필요가 없다.
        // id를 직접 정의하고 사용하려면, id에 대한 타입 및 설정이 필요합니다. 일반적으로 ObjectId를 사용하여 MongoDB의 _id와 연결합니다.

        name: {
            type: String,
            required: true,
        },
        address: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Address',
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
        bannerImage: {
            type: String,
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
                type: mongoose.Types.ObjectId,
                ref: 'Review',
            },
        ],
        storeLikes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
        collection: 'Store',
    },
);

module.exports = StoreSchema;
