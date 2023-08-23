const { Store } = require('../data-access');

const asyncHandler = require('../utils/async-handler');
const isValidPhoneNumber = require('../utils/regPhoneNum');

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
    const { userId } = req.body;
    //const userId = '64e2245ebef0ef0220e8d707';
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

module.exports = { getStoreInfo, updateStoreDetail, updateStoreLikes };
