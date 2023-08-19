const { Router } = require('express');
const reviewRepository = require('../data-access/model/review');

const router = Router();

// 모든 리뷰 조회 (임시 api)
router.get('/all', (req, res) => {
    console.log(req.url);
    const reviews = reviewRepository.getAll();
    res.status(200).json(reviews);
});

// 특정 사용자가 작성한 리뷰들 조회
router.get('/', (req, res) => {
    const userNickname = req.query.usernickname;
    const data = reviewRepository.getByUserNickname(userNickname);
    if (data.length >= 1) {
        res.status(200).json(data);
    } else {
        res.sendStatus(404);
    }
});

// 특정 리뷰 조회
router.get('/:reviewId', (req, res) => {
    const { reviewId } = req.params;
    const review = reviewRepository.getByReviewId(reviewId);
    if (review) {
        res.status(200).json(review);
    } else {
        res.sendStatus(404);
    }
});

// 특정 리뷰 수정
router.patch('/:reviewId', (req, res) => {
    const { reviewId } = req.params;
    const { grade, content } = req.body;
    const review = reviewRepository.update(reviewId, grade, content);
    if (review) {
        res.status(200).json(review);
    } else {
        res.sendStatus(404);
    }
});

// 특정 리뷰 삭제
router.delete('/:reviewId', (req, res) => {
    const { reviewId } = req.params;
    reviewRepository.remove(reviewId);
    res.sendStatus(204);
});

// 가게 리뷰들 조회
router.get('/store/:storeId', (req, res) => {
    const { storeId } = req.params;
    const storeReviews = reviewRepository.getByStoreId(storeId);
    if (storeReviews) {
        res.status(200).json(storeReviews);
    } else {
        res.sendStatus(404);
    }
});

// 가게 리뷰 생성
router.post('/store/:storeId', (req, res) => {
    const { storeId } = req.params;
    const { grade, content, usernickname, username } = req.body;
    const newReview = reviewRepository.create(storeId, grade, content, usernickname, username);
    res.status(201).json(newReview);
});

module.exports = router;
