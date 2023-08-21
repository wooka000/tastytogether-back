const { Router } = require('express');
const storeDetailController = require('../services/storeDetail');

const router = Router();

// 가게 정보 조회 api
router.get('/:storeId', storeDetailController.getStoreInfo);

// 가게정보 수정 api
router.patch('/:storeId', storeDetailController.updateStoreDetail);

// 가게 찜 추가 api
router.patch('/:storeId/storelikes', storeDetailController.updateStoreLikes);

module.exports = router;
