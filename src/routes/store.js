const { Router } = require('express');
const storeService = require('../services/store');
const verifyLogin = require('../middlewares/loginValidator');
const { uploadMultiImage } = require('../middlewares/imageUploader');

const router = Router();

// 새로운 가게 등록
router.post('/', verifyLogin, uploadMultiImage('banners'), storeService.createStore);

// 가게 중복 확인 api
router.get('/', storeService.checkStore);

// 가게 검색
router.get('/search', storeService.searchStores);

// 맛집찾기 필터(업종, 지역)
router.get('/filter', storeService.filterStores);

// 가게 상세 정보 조회 api
router.get('/:storeId', storeService.getStoreInfo);

// 가게정보 수정 api
router.patch('/:storeId', verifyLogin, storeService.updateStoreDetail);

// 가게 찜 추가 api
router.patch('/:storeId/storelikes', verifyLogin, storeService.updateStoreLikes);

module.exports = router;
