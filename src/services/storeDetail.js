const { Store, MenuItems } = require('../data-access');

const asyncHandler = require('../utils/async-handler');

// 가게 정보 조회 api 서비스 로직
const getStoreInfo = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const storeInfo = await Store.findOneAndUpdate(
        { _id: storeId },
        { $inc: { viewCount: 1 } },
    ).populate('reviews');
    const storeReviewCount = storeInfo.reviews.length;
    const userLikeList = storeInfo.storeLikes;
    const storeLikeCount = userLikeList.length;
    res.json({ storeInfo, storeReviewCount, storeLikeCount });
});

const regPhone = /^\d{2,4}-\d{3,4}-\d{4}$/;

// 전화번호 정규식 함수
const isValidPhoneNumber = (phoneNumber) => regPhone.test(phoneNumber);

// 가게 정보 수정 api 서비스 로직
const updateStoreDetail = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    const {
        menuName1,
        menuName2,
        menuName3,
        menuPrice1,
        menuPrice2,
        menuPrice3,
        newPhone,
        newPriceRange,
        newParkingInfo,
        newBusinessHours,
        newClosedDays,
    } = req.body;

    const menuNames = [menuName1, menuName2, menuName3];
    const menuPrice = [menuPrice1, menuPrice2, menuPrice3];

    if (!isValidPhoneNumber(newPhone)) {
        const error = new Error('전화번호 형식에 맞게 작성해주세요.');
        error.statusCode = 400;
        throw error;
    }

    const result = await Store.findOneAndUpdate(
        { _id: storeId },
        {
            phone: newPhone,
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

    const menuList = result.menuItems;
    await Promise.all(
        menuList.map((id, idx) =>
            MenuItems.findOneAndUpdate(
                { _id: id },
                {
                    itemName: menuNames[idx],
                    itemPrice: menuPrice[idx],
                },
            ),
        ),
    ).catch(() => {
        const error = new Error('서버 오류 발생');
        error.statusCode = 500;
        throw error;
    });

    res.sendStatus(200);
});

// 유저 좋아요 여부 함수
const isUserLike = (userLikeList, userId) =>
    userLikeList.findIndex((el) => el.toString() === userId);
// 가게 찜 추가 로직
const updateStoreLikes = asyncHandler(async (req, res) => {
    const { storeId } = req.params;
    // const userId = jwtVerify(req);
    const userId = '64e2245ebef0ef0220e8d707';
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
