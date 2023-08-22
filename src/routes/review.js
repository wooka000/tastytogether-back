const { Router } = require('express');
const reviewController = require('../services/review');

const router = Router();

// 특정 사용자가 작성한 리뷰들 조회
router.get('/user/:userId', reviewController.getUserReviews);

// 특정 리뷰 조회
router.get('/:reviewId', reviewController.getReviewById);

// 특정 가게 리뷰 조회
router.get('/store/:storeId', reviewController.getByStoreId);

// 가게 리뷰 생성
router.post('/store/:storeId', reviewController.createReview);

module.exports = router;
