const { Router } = require('express');
const storeService = require('../services/storeService');

const router = Router();

// 업체 중복 확인 api
router.get('/', storeService.checkStore);
// 새로운 업체 등록
router.post('/', storeService.createStore);
// 가게 검색
router.get('/search', storeService.searchStores);
// // 맛집찾기 필터(업종, 지역)
// router.get('/filter?type=type&region=city/state', storeService.filterStores);

module.exports = router;
