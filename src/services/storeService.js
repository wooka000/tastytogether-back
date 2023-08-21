const { Store, menuItems } = require('../data-access');
// 허스키 eslint로 인해 잠시 주석 처리
// const { Store, Review, menuItems } = require('../data-access');

// ?????????
const createStore = async (req, res) => {
    const {
        name,
        address,
        storeType,
        phone,
        priceRange,
        parkingInfo,
        businessHours,
        closedDays,
        bannerImage,
    } = req.body;

    const regPhone = /^\d{2,4}-\d{3,4}-\d{4}$/;
    if (!regPhone.test(phone)) {
        const error = new Error('전화번호 형식에 맞게 작성해주세요.');
        error.statusCode = 400;
        throw error;
    }
    // 해당 값이 없는 경우 에러를 보여주다.
    if (!address) {
        const error = new Error('주소를 확인하세요');
        error.statusCode = 400;
        throw error;
    }
    if (!storeType) {
        const error = new Error('업종을 작성해주세요');
        error.statusCode = 400;
        throw error;
    }
    if (!priceRange) {
        const error = new Error('가격대를 작성해주세요');
        error.statusCode = 400;
        throw error;
    }
    if (!parkingInfo) {
        const error = new Error('주차정보를 작성해주세요');
        error.statusCode = 400;
        throw error;
    }
    if (!closedDays) {
        const error = new Error('휴무일을 작성해주세요');
        error.statusCode = 400;
        throw error;
    }
    if (!menuItems) {
        const error = new Error('대표메뉴를 확인하세요');
        error.statusCode = 400;
        throw error;
    } else if (!bannerImage) {
        const error = new Error('이미지를 업로드해주세요');
        error.statusCode = 400;
        throw error;
    }

    await Store.create({
        name,
        address,
        storeType,
        phone,
        menuItems: [],
        priceRange,
        parkingInfo,
        businessHours,
        closedDays,
        bannerImage,
        reviews: [],
        storeLikes: [],
    });
    res.status(201).send('가게 정보가 등록되었습니다.');
};

// 가게 검색하는 경우(기본 정렬 적용)
const searchStores = async (req, res) => {
    const keyword = req.query.storesearch;
    // const starRating = req.query.starrating; // starRating 파라미터가 필요한 경우

    if (keyword) {
        const searchStoreList = await Store.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { 'address.city': { $regex: keyword, $options: 'i' } },
                { 'address.street': { $regex: keyword, $options: 'i' } },
                { 'address.state': { $regex: keyword, $options: 'i' } },
                { 'menuItems.itemName': { $regex: keyword, $options: 'i' } },
            ],
        });

        // searchStoreList.sort(async (a, b) => {
        //     const aReviewCount = await Review.countDocuments({ storeId: a._id });
        //     const bReviewCount = await Review.countDocuments({ storeId: b._id });
        //     const aStoreLike = await Store.findOne({ storeId: a._id }); // StoreLike관련
        //     const bStoreLike = await Store.findOne({ storeId: b._id });

        //     if (starRating) {
        //         return b.starRating - a.starRating;
        //     } else if (aReviewCount && bReviewCount) bReviewCount - aReviewCount;
        //     else if (aStoreLike && bStoreLike) {
        //         return bStoreLike.count - aStoreLike.count;
        //     } else {
        //         a.name.localeCompare(b.name);
        //     }
        // });

        res.render('storesearch', { keyword, searchStoreList });
    } else {
        res.render('storesearch', { keyword, searchStoreList: [] });
    }
};
// 맛집찾기 필터(업종, 지역)
const filterStores = async (req, res) => {
    const typeFilter = req.query.type;
    const regionFilter = req.query.region;

    const filter = {};

    if (typeFilter) {
        filter.storeType = typeFilter;
    }
    if (regionFilter) {
        const subRegions = regionFilter.split('/');

        // filter[Address.city] = subRegions[0];

        if (subRegions.length > 1) {
            // filter[Address.state] = subRegions[1];
        }
    }
    // 필터 조건에 따른 가게 리스트 가져오기
    // const filterStoreList = await Store.find(filter);

    // 가게 리스트 기본 정렬: 1. 리뷰순, 2. 좋아요순, 3. 가게 이름순
//     filterStoreList.sort(async (a, b) => {
        // const aReviewCount = await Review.countDocuments({ storeId: a._id });
        // const bReviewCount = await Review.countDocuments({ storeId: b._id });
        // const aStoreLike = await Store.findOne({ storeId: a._id }); // StoreLike
        // const bStoreLike = await Store.findOne({ storeId: b._id });

        // if (starRating) {
        //     return b.starRating - a.starRating;
        // } else if (aReviewCount && bReviewCount) {
        //     return bReviewCount - aReviewCount;
        // } else if (aStoreLike && bStoreLike) {
        //     return bStoreLike.count - aStoreLike.count;
        // } else {
        //     return a.name.localeCompare(b.name);
        // }
    // });
//     res.render('storesearch', { filterStoreList });
//     res.json({ filterStoreList });
// eslint로 인한 임시 코드
res.send()
};

module.exports = { createStore, searchStores, filterStores }
