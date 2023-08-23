const { Router } = require('express');
const reviewController = require('../services/review');

const router = Router();

// 특정 리뷰 조회 O
router.get('/:reviewId', reviewController.getReviewById);

// 리뷰 수정 api O
router.patch('/:reviewid', reviewController.editReview);

// 리뷰 삭제 api O
router.delete('/:reviewid', reviewController.deleteReview);

// 특정 가게 리뷰 조회 X
router.get('/store/:storeId', reviewController.getByStoreId);

// 가게 리뷰 생성 X
router.post('/store/:storeId', reviewController.createReview);

module.exports = router;
