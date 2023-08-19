const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const { getStoreInfo, editStoreDetail } = require('../services/getStoreDetail');

const router = Router();

const regPhone = /^\d{2,4}-\d{3,4}-\d{4}$/;

// 가게 정보 조회 api
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { storeId } = req.params;
        const storeDetail = getStoreInfo(storeId);
        res.json(storeDetail);
    }),
);

// 가게정보 수정 api
router.patch(
    '/',
    asyncHandler(async (req, res) => {
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
        if (!regPhone.test(newPhone)) {
            const error = new Error('전화번호 형식에 맞게 작성해주세요.');
            error.statusCode = 400;
            throw error;
        }
        const result = editStoreDetail(
            storeId,
            newPhone,
            [menuName1, menuName2, menuName3],
            [menuPrice1, menuPrice2, menuPrice3],
            newPriceRange,
            newParkingInfo,
            newBusinessHours,
            newClosedDays,
        );

        if (!result) {
            res.status(400).send();
            return;
        }
        res.status(200).send();
    }),
);

// 가게 찜 추가
// router.patch(
//     '/storelikes',
//     asyncHandler(async (req, res) => {}),
// );

// 가게 찜 삭제
module.exports = router;
