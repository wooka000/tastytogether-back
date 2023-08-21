const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const storeService = require('../services/storeService');

const router = Router();

// 새로운 업체 등록
router.post('/stores', asyncHandler(storeService.createStore));

// 가게 검색
router.get('/stores', asyncHandler(storeService.searchStores));

// 맛집찾기 필터(업종, 지역)
router.get('/stores', asyncHandler(storeService.filterStores));

module.exports = router;