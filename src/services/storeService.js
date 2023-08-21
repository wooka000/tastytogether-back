
const { Store } = require('../data-access');
// 허스키 eslint로 인해 잠시 주석 처리
// const { Store, Review, menuItems } = require('../data-access');


const checkStore = async (req, res) => {
    const { name, address } = req.body;
    
    const checkName = await Store.findOne({ name });
    const checkAddress = await Store.findOne({ address });
    
    if (checkName && checkAddress) {
        const error = new Error('이미 같은 가게가 존재합니다.');
        error.statusCode = 409;
        throw error;
    } else {
        res.status(200).send('가게 확인 완료');
    }
});

const createStore = async (req, res) => {
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
    return res.status(201).json({ message: '가게 정보가 등록되었습니다.' });
};

// 가게 검색하는 경우(기본 정렬 적용)
// async function searchStores(req, res) {
//     const keyword = req.query;

//     if (keyword) {
//         const searchStoreList = await Store.find({
//             $or: [
//                 { name: { $regex: keyword, $options: 'i' } },
//                 { 'address.city': { $regex: keyword, $options: 'i' } },
//                 { 'address.street': { $regex: keyword, $options: 'i' } },
//                 { 'address.state': { $regex: keyword, $options: 'i' } },
//                 { type: { $regex: keyword, $options: 'i' } },
//             ],
//         });
//         searchStoreList.sort(async (a, b) => {
//             if (starRating) {
//                 return b.starRating - a.starRating;
//             } else if (Review.reviews) {
//                 return b.Review.reviews.length - a.Review.reviews.length;
//             } else if (storeLikes) {
//                 return b.User.storeLikes.length - b.User.storeLikes.length;
//             }
//         });
//         res.json({ searchStoreList });
//     } else {
//         res.json({ searchStoreList: [] });
//     }
// }

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

//     //가게 리스트 기본 정렬: 1. 별점순, 2. 리뷰순, 3. 좋아요순
//     filterStoreList.sort(async (a, b) => {
//         if (starRating) {
//             return b.starRating - a.starRating;
//         } else if (Review.reviews) {
//             return b.Review.reviews.length - a.Review.reviews.length;
//         } else if (storeLikes) {
//             return b.User.storeLikes.length - b.User.storeLikes.length;
//         }
//     });
//     res.render('storesearch', { filterStoreList: filterStoreList });
//     res.json({ filterStoreList });
// }

module.exports = { checkStore, createStore };
// searchStores, filterStores
