
const checkDuplicate = async ({ name, street }) => {
    const streetData = await Store.findOne({ name }).populate('address', 'street');
    if (!streetData) {
        return false;
    }
    return streetData.address.street === street;
};

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

    const regPhone = /^\d{2,4}-\d{3,4}-\d{4}$/;
    if(!regPhone.test(phone)
        || !address
        || !storeType
        || !priceRange
        || !parkingInfo
        || !closedDays
        || !menuItems
        || !bannerImage
    ){return res.status(400).json({ error: '입력하지 않은 값이 존재합니다.' });}
    // 새로운 가게 정보를 DB에 생성
    // 필수값이 아니면 0 또는 []이 기본값이 된다.
    // 새로운 가게 정보를 DB에 생성
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
});

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
