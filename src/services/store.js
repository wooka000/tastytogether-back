const { Store } = require('../data-access');
const asyncHandler = require('../utils/async-handler');
const isValidPhoneNumber = require('../utils/regPhoneNum');
const multiImageAddress = require('../utils/multiImageAddressHandler');
const photoLimit = require('../utils/photoLimit');

// 가게 중복 확인 api
const checkDuplicate = async ({ name, street }) => {
    const store = await Store.findOne({ name });
    if (!store) {
        return false;
    }
    return store.address.street === street;
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
    } = req.body;

    const newBanners = multiImageAddress(req.files);

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
        !newBanners
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
    if (!photoLimit(newBanners)) {
        const error = new Error('사진은 최대 8장 까지만 업로드 가능합니다.');
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
        banners: newBanners,
        starRating: 0,
        viewCount: 0,
        reviews: [],
        storeLikes: [],
    });
    return res.sendStatus(201);
});

// 가게 정보 조회 api 서비스 로직
const getStoreInfo = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const storeInfo = await Store.findOneAndUpdate(
        { _id: storeId },
        { $inc: { viewCount: 1 } },
        { new: true },
    ).populate('reviews');
    const storeReviewCount = storeInfo.reviews.length;
    const userLikeList = storeInfo.storeLikes;
    const storeLikeCount = userLikeList.length;
    res.json({ storeInfo, storeReviewCount, storeLikeCount });
});

// 가게 정보 수정 api 서비스 로직
const updateStoreDetail = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const {
        newPhone,
        newMenuItems,
        newPriceRange,
        newParkingInfo,
        newBusinessHours,
        newClosedDays,
    } = req.body;

    if (
        !newPhone ||
        !newMenuItems ||
        !newPriceRange ||
        !newParkingInfo ||
        !newBusinessHours ||
        !newClosedDays
    ) {
        const error = new Error('입력하지 않은 값이 존재합니다.');
        error.statusCode = 400;
        throw error;
    }

    if (!isValidPhoneNumber(newPhone)) {
        const error = new Error('전화번호 형식에 맞게 작성해주세요.');
        error.statusCode = 400;
        throw error;
    }

    const result = await Store.findOneAndUpdate(
        { _id: storeId },
        {
            phone: newPhone,
            menuItems: newMenuItems,
            priceRange: newPriceRange,
            parkingInfo: newParkingInfo,
            businessHours: newBusinessHours,
            closedDays: newClosedDays,
        },
    );

    if (!result) {
        const error = new Error('서버 오류 발생');
        error.statusCode = 500;
        throw error;
    }

    res.sendStatus(200);
});

// 유저 좋아요 여부 함수
const isUserLike = (userLikeList, userId) =>
    userLikeList.findIndex((el) => el.toString() === userId);

// 가게 찜 추가 로직
const updateStoreLikes = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const { userId } = req.userData;
    // const userId = '64e2245ebef0ef0220e8d707';
    const storeInfo = await Store.findOne({ _id: storeId });
    const userLikeList = [...storeInfo.storeLikes];
    const likeIndex = isUserLike(userLikeList, userId);
    if (likeIndex === -1) {
        userLikeList.push(userId);
        res.status(201);
    } else {
        userLikeList.splice(likeIndex, 1);
        res.status(200);
    }
    await Store.updateOne({ _id: storeId }, { storeLikes: userLikeList });
    res.end();
});

// 가게 검색 api
const searchStores = asyncHandler(async (req, res) => {
    try {
        const result = await Store.aggregate([
            {
                $search: {
                    index: 'searchStore',
                    text: {
                        query: req.query.keyword,
                        path: {
                            wildcard: '*',
                        },
                    },
                },
            },

            {
                $sort: { score: { $meta: 'textScore' } },
            },
        ]);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// 맛집찾기 필터(업종, 지역)
const filterStores = asyncHandler(async (req, res) => {
    const { type, region } = req.query;
    const city = region.split('/')[0];
    const state = region.split('/')[1];

    if (type === '' && region === '') {
        const error = new Error('필터 선택이 되지 않았습니다.');
        error.statusCode = 400;
        throw error;
    }
    if (region === '') {
        try {
            const typeResult = await Store.find({ type });
            res.json(typeResult);
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    }
    if (type === '') {
        try {
            const regionResult = await Store.find({ 'address.city': city, 'address.state': state });
            res.json(regionResult);
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    }
    const filterResult = await Store.find({ type, 'address.city': city, 'address.state': state });
    if (!filterResult) {
        const error = new Error('서버 오류 발생');
        error.statusCode = 500;
        throw error;
    }
    res.json(filterResult);
});

module.exports = {
    checkStore,
    createStore,
    getStoreInfo,
    updateStoreDetail,
    updateStoreLikes,
    searchStores,
    filterStores,
};
