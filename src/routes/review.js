const { Router } = require('express');
const verifyLogin = require('../middlewares/loginValidator');
const reviewController = require('../services/review');

const router = Router();

// 특정 리뷰 조회 O
router.get('/:reviewId', reviewController.getReviewById);

// 리뷰 생성 api O
router.post('/:storeId', verifyLogin, reviewController.createReview);

// 리뷰 수정 api O
router.patch('/:reviewId', verifyLogin, reviewController.editReview);

// 리뷰 삭제 api O
router.delete('/:reviewId', verifyLogin, reviewController.deleteReview);

module.exports = router;
