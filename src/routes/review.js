const { Router } = require('express');
const reviewController = require('../services/review');

const router = Router();

// 모든 리뷰 조회 (임시 api)
router.get('/all', reviewController.getAll);

// 특정 사용자가 작성한 리뷰들 조회
router.get('/', reviewController.getByUserNickname);

// 특정 리뷰 조회
router.get('/:reviewId', reviewController.getByReviewId);

// 특정 리뷰 수정
router.patch('/:reviewId', reviewController.update);

// 특정 리뷰 삭제
router.delete('/:reviewId', reviewController.remove);

// 가게 리뷰들 조회
router.get('/store/:storeId', reviewController.getByStoreId);

// 가게 리뷰 생성
router.post('/store/:storeId', reviewController.create);

module.exports = router;
