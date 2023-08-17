const { Router } = require('express');
// const { Store, Review, User } = require('../data-access');
const { Store, Review } = require('../data-access'); // 커밋용코드
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.get(
    '/',
    asyncHandler(async (req, res) => {
        // const userEmail = jwtVerify(req);
        const { storeIdInfo } = req.params;
        const store = await Store.findOneAndUpdate(
            { storeId: storeIdInfo },
            { $inc: { viewCount: 1 } },
            { new: true },
        );
        // const userStoreLike = await User.findOne({ email: userEmail, storeLikeList: storeIdInfo });
        const reviewCount = await Review.count({ storeIdInfo });
        res.send({ store, reviewCount }); // 커밋용 코드
        // res.send({ store, reviewCount, userStoreLike });
    }),
);

router.patch(
    '/',
    asyncHandler(async (req, res) => {
        const { storeId } = req.params;
        const {
            newStorePhone,
            newMenuItmes,
            newPriceRange,
            newParkingInfo,
            newBusinessHours,
            newClosedDays,
        } = req.body;
        const regPhone = /^\d{2,4}-\d{3,4}-\d{4}$/;
        if (!regPhone.test(newStorePhone)) {
            const error = new Error('전화번호 형식에 맞게 작성해주세요.');
            error.statusCode = 400;
            throw error;
        }
        await Store.findOneAndUpdate(
            { storeId },
            {
                storePhone: newStorePhone,
                menuItmes: newMenuItmes,
                priceRange: newPriceRange,
                parkingInfo: newParkingInfo,
                businessHours: newBusinessHours,
                closedDays: newClosedDays,
            },
        );
        res.json({ message: '가게정보가 수정되었습니다.' });
    }),
);

router.patch(
    '/storelikes',
    asyncHandler(async (req, res) => {
        const storeIdInfo = req.params;
        // const userEmail = jwtVerify(req);
        // const userStoreLike = await User.findOne({ email: userEmail, storeLikeList: storeIdInfo });
        // if (userStoreLike) {
        const store = await Store.findOneAndUpdate(
            { storeId: storeIdInfo },
            { $inc: { viewCount: -1 } },
            { new: true },
        );

        // await User.updateOne({ email: userEmail }, { $pull: { storeLikeList: storeIdInfo } });
        res.send(store);
        // } else {
        //     const store = await Store.findOneAndUpdate(
        //         { storeId: storeIdInfo },
        //         { $inc: { viewCount: 1 } },
        //         { new: true },
        //     );
        //     // await User.updateOne({ email: userEmail }, { $push: { storeLikeList: storeIdInfo } });
        //     res.send(store);
        // }
    }),
);
module.exports = router;
