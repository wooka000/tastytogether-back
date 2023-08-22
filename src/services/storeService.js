const { Store, MenuItems, Address } = require('../data-access');
const asyncHandler = require('../utils/async-handler');
const isValidPhoneNumber = require('../utils/regPhoneNum');

// 가게 중복 확인 api
const checkDuplicate = async ({ name, street }) => {
    const streetData = await Store.findOne({ name }).populate('address', 'street');
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
        street,
        city,
        state,
        zipCode,
        latitude,
        longitude,
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
        !street ||
        !city ||
        !state ||
        !zipCode ||
        !latitude ||
        !longitude ||
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

    const newMenuItems = await MenuItems.insertMany(menuItems);
    const newMenuItemsIdList = newMenuItems.map((el) => el._id);
    const newAddress = await Address.create({ street, city, state, zipCode, latitude, longitude });

    if (
        !name ||
        !street ||
        !city ||
        !state ||
        !zipCode ||
        !latitude ||
        !longitude ||
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

    const newMenuItems = await MenuItems.insertMany(menuItems);
    const newMenuItemsIdList = newMenuItems.map((el) => el._id);
    const newAddress = await Address.create({ street, city, state, zipCode, latitude, longitude });

    await Store.create({
        name,
        address: newAddress._id,
        type,
        phone,
        menuItems: newMenuItemsIdList,
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
        .createIndex(
            { name: 'text', address: 'text', type: 'text', menuItems: 'text' },
            { weights: { name: 3, address: 1, type: 1, menuItems: 1 } },
        );

    const searchResult = await db
        .collection('Store')
        .aggregate([
            {
                $match: { $text: { $search: keyword } },
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
// async function filterStores(req, res) {
//     const typeFilter = req.query.type;
//     const regionFilter = req.query.region;

//     const filter = {};

//     if (typeFilter) {
//         filter.type = typeFilter;
//     }
//     if (regionFilter) {
//         const subRegions = regionFilter.split('/');

//         filter['Address.city'] = subRegions[0];

//         if (subRegions.length > 1) {
//             filter['Address.state'] = subRegions[1];
//         }
//     }
//     //필터 조건에 따른 가게 리스트 가져오기
//     let filterStoreList = await Store.find(filter);

//     res.render('storesearch', { filterStoreList: filterStoreList });
//     res.json({ filterStoreList });
// }

module.exports = { checkStore, createStore, searchStores };
// searchStores, filterStores
