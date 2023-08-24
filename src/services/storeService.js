const mongoose = require('mongoose');
const { Store } = require('../data-access');
const asyncHandler = require('../utils/async-handler');
const isValidPhoneNumber = require('../utils/regPhoneNum');

const db = mongoose.connection;

// 가게 중복 확인 api
const checkDuplicate = async ({ name, street }) => {
    const streetData = await Store.findOne({ name });
    if (!streetData) {
        return false;
    }
    return streetData.address.street === street;
};

// 가게 등록 api
const checkStore = asyncHandler(async (req, res) => {
    const { name, street } = req.body;

    if (await checkDuplicate({ name, street })) {
        const error = new Error('이미 같은 가게가 존재합니다.');
        error.statusCode = 409;
        throw error;
    } else {
        res.status(200).send('가게 확인 완료');
    }
});

const createStore = asyncHandler(async (req, res) => {
    const {
        name,
        address,
        type,
        phone,
        menuItems,
        priceRange,
        parkingInfo,
        businessHours,
        closedDays,
        banners,
    } = req.body;

    if (
        !name ||
        !address ||
        !type ||
        !phone ||
        !menuItems ||
        !priceRange ||
        !parkingInfo ||
        !businessHours ||
        !closedDays ||
        !banners
    ) {
        const error = new Error('입력하지 않은 값이 존재합니다.');
        error.statusCode = 400;
        throw error;
    }
    if (!isValidPhoneNumber(phone)) {
        const error = new Error('전화번호 형식에 맞게 작성해주세요.');
        error.statusCode = 400;
        throw error;
    }

    await Store.create({
        name,
        address,
        type,
        phone,
        menuItems,
        priceRange,
        parkingInfo,
        businessHours,
        closedDays,
        banners,
        starRating: 0,
        viewCount: 0,
        reviews: [],
        storeLikes: [],
    });
    return res.sendStatus(201);
});

// 가게 검색 api
const searchStores = asyncHandler(async (req, res) => {
    const { keyword } = req.query;
    await db
        .collection('Store')
        .createIndex({ name: 'text', type: 'text' }, { weights: { name: 3, type: 1 } });

    const searchResult = await db
        .collection('Store')
        .aggregate([
            {
                $match: {
                    $text: { $search: keyword },
                    $or: [
                        { address: { $regex: /keyword/, $options: 'i' } },
                        { menuItems: { $regex: /keyword/, $options: 'i' } },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'Address',
                    localField: 'address',
                    foreignField: '_id',
                    as: 'addressInfo',
                },
            },
            {
                $lookup: {
                    from: 'MenuItems',
                    localField: 'menuItems',
                    foreignField: '_id',
                    as: 'menuItemsInfo',
                },
            },

            {
                $project: {
                    name: 1,
                    type: 1,
                    addressInfo: 1,
                    menuItemsInfo: 1,
                },
            },
            {
                $sort: { score: { $meta: 'textScore' } },
            },
        ])
        .toArray();

    res.json(searchResult);
});

// 맛집찾기 필터(업종, 지역)

module.exports = { checkStore, createStore, searchStores };
// searchStores, filterStores
