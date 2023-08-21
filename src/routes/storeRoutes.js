const { Router } = require('express');
const storeService = require('../services/storeService');

const router = Router();
// 업체 확인
router.get('/', storeService.checkStore);
// 새로운 업체 등록
router.post('/', storeService.createStore);
// 가게 검색
router.get('/search?q=keyword', storeService.searchStores);
// 맛집찾기 필터(업종, 지역)
router.get('/search?type=type&region=city/state', storeService.filterStores);

module.exports = router;
